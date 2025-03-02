import { AuthContextProvider } from "./AuthContext"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { LocalStorage } from "@/utils/LocalStorage"
import { useSQLiteContext } from "expo-sqlite"
import DefaultLoadingScreen from "@/components/screens/general/DefaultLoadingScreen"
import DreamsDb from "@/db/dreamsDb"
import DreamService from "@/services/api/DreamService"
import InternetInfo from "../utils/InternetInfo"
import SleepsDb from "@/db/sleepsDb"
import SleepService from "@/services/api/SleepService"
import UserService from "@/services/api/UserService"

type SyncContextProps = {
    children: JSX.Element | JSX.Element[]
}

type SyncContext = {
    /** Ref de conexão de internet */
    isConnectedRef: React.MutableRefObject<boolean>
    /** Verifica se há conectividade com internet */
    checkIsConnected: () => boolean
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
                    await syncCloudData()
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

            for (const dream of dreams) {
                try {
                    await DreamService.Create(true, {
                        ...dream,
                        tags: dream.dreamTags ?? [],
                        dreamNoSleepDateKnown: null,
                        dreamNoSleepTimeKnown: null,
                    })
                }
                catch (ex) {
                }
            }

            const sleeps = await SleepsDb.GetAllNotSyncronized(db)

            for (const sleep of sleeps) {
                try {
                    await SleepService.Create(true, {
                        ...sleep,
                        dreams: [],
                    })
                }
                catch (ex) {
                }
            }

            setLoadingLocalSyncProcess(false)
        } catch (ex) {
            setLoadingLocalSyncProcess(false)
        }
    }

    /** realiza a sincronização de dados em nuvem com dados locais */
    const syncCloudData = async (): Promise<void> => {
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

            const syncRecordsResponse = await UserService.SyncRecords({ monthDate: null })

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
                catch (ex) {
                }
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
                catch (ex) {
                }
            }

            setLoadingCloudSyncProcess(false)

            await LocalStorage.syncCloudDataLastSync.set(DateFormatter.luxon.now().toMillis())
        } catch (ex) {
            console.error("Houve um erro ao atualizar os dados em nuvem:", (ex as Error).message)
            setLoadingCloudSyncProcess(false)
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