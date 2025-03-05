import { AuthContextProvider } from "./AuthContext"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { ExportUserData } from "@/types/userData"
import { LocalStorage } from "@/utils/LocalStorage"
import { useSQLiteContext } from "expo-sqlite"
import DefaultLoadingScreen from "@/components/screens/general/DefaultLoadingScreen"
import DreamsDb from "@/db/dreamsDb"
import InternetInfo from "../utils/InternetInfo"
import SleepsDb from "@/db/sleepsDb"
import UserService from "@/services/api/UserService"

type SyncContextProps = {
    children: JSX.Element | JSX.Element[]
}

type SyncContext = {
    /** Ref de conexão de internet */
    isConnectedRef: React.MutableRefObject<boolean>
    /** Verifica se há conectividade com internet */
    checkIsConnected: () => boolean
    /** Sincroniza os dados locais com a nuvem */
    syncCloudData: (date: Date | null) => Promise<void>
}

const SyncContext = createContext<SyncContext | null>(null)

/** Context especializado na verificação de conectividade e sincronização dos dados da aplicação */
export default function SyncContextComponent({ children }: SyncContextProps) {
    const db = useSQLiteContext()
    const { isLogged } = AuthContextProvider()
    const isConnectedRef = useRef<boolean>(false)
    const [ loadingInternetInfo, setLoadingInternetInfo ] = useState<boolean>(true)
    const [ loadingLocalSyncProcess, setLoadingLocalSyncProcess ] = useState<boolean>(true)
    const [ loadingCloudSyncProcess, setLoadingCloudSyncProcess ] = useState<boolean>(true)

    useEffect(() => {
        InternetInfo()
            .then(async (result) => {
                // Será definida a informação do REF sobre a conexão de internet antes do interval de 5 segundos 
                isConnectedRef.current = result ? result.isConnected : false
                setLoadingInternetInfo(false)

                if (isLogged) {
                    await syncLocalData()
                    await syncCloudDataFirstProcess()
                }
                else {
                    setLoadingLocalSyncProcess(false)
                    setLoadingCloudSyncProcess(false)
                }
            })

        /** Intervalo de verificação de conectividade */
        const syncInterval = setInterval(async () => {
            await InternetInfo()
                .then(result => { isConnectedRef.current = result ? result.isConnected : false })
        }, 5000)

        return () => {
            clearInterval(syncInterval)
        }
    }, [])

    /** realiza a sincronização de dados locais com a nuvem */
    const syncLocalData = async (): Promise<void> => {
        if (!isConnectedRef.current) {
            setLoadingLocalSyncProcess(false)
            return
        }

        try {
            const dreams = await DreamsDb.GetAllNotSyncronized(db)
            const sleeps = await SleepsDb.GetAllNotSyncronized(db)

            if (dreams.length === 0 && sleeps.length === 0)
                throw new Error("Nenhum registro para sincronizar.")

            for (const dream of dreams) {
                try {
                    const newIdResponse = await UserService.CheckSynchronizedRecord({
                        dreamTitle: dream.title,
                        sleepCycle: null,
                    })

                    if (newIdResponse.Success) {
                        if (newIdResponse.Data === dream.id)
                            continue

                        await DreamsDb.UpdateId(db, dream, newIdResponse.Data)
                        dream.synchronized = true
                    }
                }
                catch { }
            }

            for (const sleep of sleeps) {
                try {
                    const newIdResponse = await UserService.CheckSynchronizedRecord({
                        dreamTitle: null,
                        sleepCycle: {
                            date: sleep.date,
                            sleepStart: sleep.sleepStart,
                            sleepEnd: sleep.sleepEnd,
                        },
                    })

                    if (newIdResponse.Success) {
                        if (newIdResponse.Data === sleep.id)
                            continue

                        await SleepsDb.UpdateId(db, sleep, newIdResponse.Data)
                        sleep.synchronized = true
                    }
                }
                catch { }
            }

            const importData: ExportUserData = {
                dreams: [],
                sleeps: [],
            }

            dreams.map(dream => {
                if (!dream.synchronized) {
                    importData.dreams.push({
                        ...dream,
                        dreamTags: dream.dreamTags ?? [],
                    })
                }
            })

            sleeps.map(sleep => {
                if (!sleep.synchronized) {
                    importData.sleeps.push(sleep)
                }
            })

            dreams.length = 0
            sleeps.length = 0

            if (importData.dreams.length > 0 && importData.sleeps.length > 0) {
                await UserService.ImportUserData({
                    dreamsPath: null,
                    fileContent: JSON.stringify(importData),
                    isSameOriginImport: true,
                    sendEmailOnFinish: false,
                })
            }

            setLoadingLocalSyncProcess(false)
        } catch (ex) {
            setLoadingLocalSyncProcess(false)
        }
    }

    const syncCloudDataFirstProcess = async (): Promise<void> => {
        if (!isConnectedRef.current) {
            setLoadingCloudSyncProcess(false)
            return
        }

        try {
            const shouldSyncCloudData = await LocalStorage.syncCloudDataLastSync.get()
                .then(result => {
                    if (!result) return true
                    return DateFormatter.luxon.now().diff(DateTime.fromMillis(result), "hours").hours > 24
                })

            if (!shouldSyncCloudData) {
                setLoadingCloudSyncProcess(false)
                return
            }

            await syncCloudData(null)

            setLoadingCloudSyncProcess(false)

            await LocalStorage.syncCloudDataLastSync.set(DateFormatter.luxon.now().toMillis())
        } catch (ex) {
            console.error("Houve um erro ao atualizar os dados em nuvem:", (ex as Error).message)
            setLoadingCloudSyncProcess(false)
        }
    }

    const syncCloudData = async (date: Date | null): Promise<void> => {
        try {
            const syncRecordsResponse = await UserService.SyncRecords({
                monthDate: date
                    ? DateFormatter.forBackend.date(date.getTime())
                    : null
            })

            if (!syncRecordsResponse.Success)
                throw new Error(syncRecordsResponse.ErrorMessage)

            for (const dreamRecord of syncRecordsResponse.Data.dreams) {
                try {
                    const dbDream = await DreamsDb.Get(db, dreamRecord.id)

                    if (dbDream) {
                        await DreamsDb.Update(db, {
                            ...dreamRecord,
                            isComplete: true,
                            synchronized: true,
                        })
                    }
                    else {
                        await DreamsDb.Create(db, {
                            ...dreamRecord,
                            isComplete: true,
                            synchronized: true,
                        })
                    }
                }
                catch { }
            }

            for (const sleepRecord of syncRecordsResponse.Data.sleeps) {
                try {
                    const dbSleep = await SleepsDb.Get(db, sleepRecord.id)

                    if (dbSleep) {
                        await SleepsDb.Update(db, {
                            ...sleepRecord,
                            synchronized: true,
                        })
                    }
                    else {
                        await SleepsDb.Create(db, {
                            ...sleepRecord,
                            synchronized: true,
                        })
                    }
                }
                catch { }
            }
        } catch (ex) {
            console.error("Houve um erro ao atualizar os dados em nuvem:", (ex as Error).message)
        }
    }

    const checkIsConnected = (): boolean => {
        return isConnectedRef.current
    }

    if (
        loadingInternetInfo ||
        loadingLocalSyncProcess ||
        loadingCloudSyncProcess
    ) return <DefaultLoadingScreen message="Sincronizando dados..." />

    return (
        <SyncContext.Provider value={{
            isConnectedRef,
            checkIsConnected,
            syncCloudData,
        }}>
            { children }
        </SyncContext.Provider>
    )
}

export function SyncContextProvider() {
    const context = useContext(SyncContext)
    if (!context) throw new Error("SyncContext chamado fora do provider.")
    return context
}