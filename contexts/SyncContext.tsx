import { AuthContextProvider } from "./AuthContext"
import { CreateCompleteDreamModel, DreamDbModel } from "@/types/dream"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { CreateSleepCycleModel, SleepDbModel } from "@/types/sleeps"
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
    /** Realiza a sincronização dos dados da nuvem com os locais */
    syncLocalData: () => Promise<void>
    /** Realiza a sincronização de um sonho após a criação online */
    syncCreateDream: (sleepId: number | null, sleepDateInfo: CreateCompleteDreamModel | null) => Promise<void>
    /** Realiza a sincronização de um ciclo de sono após criação online */
    syncCreateSleepCycle: (model: CreateSleepCycleModel) => Promise<void>
    /** Realiza a dessincronização de um registro localmente (após update) */
    desynchronizeRecord: (id: number, type: "dream" | "sleep") => Promise<void>
    /** Realiza a exclusão de um registro local */
    deleteRecord: (id: number, type: "dream" | "sleep") => Promise<void>
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

                        dream.synchronized = true
                        await DreamsDb.UpdateId(db, dream, newIdResponse.Data)
                    }
                }
                catch (e) {
                    console.log(`Erro ao sincronizar o sonho ${ dream.title } para a nuvem.`)
                }
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

                        sleep.synchronized = true
                        await SleepsDb.UpdateId(db, sleep, newIdResponse.Data)
                    }
                }
                catch (e) {
                    console.log(`Erro ao sincronizar o ciclo de sono ${ sleep.date } para a nuvem.`)
                }
            }

            const importData: ExportUserData = {
                dreams: [],
                sleeps: [],
            }

            dreams.map(dream => {
                if (!dream.synchronized) {
                    const { synchronized, ...parsedDream } = dream
                    importData.dreams.push({
                        ...parsedDream,
                        dreamTags: dream.dreamTags ? JSON.parse(dream.dreamTags as any) : [],
                        id: dream.id!
                    })
                }
            })

            sleeps.map(sleep => {
                if (!sleep.synchronized) {
                    const { synchronized, ...parsedSleep } = sleep
                    importData.sleeps.push({ ...parsedSleep, id: sleep.id! })
                }
            })

            dreams.length = 0
            sleeps.length = 0

            if (importData.dreams.length > 0 || importData.sleeps.length > 0) {
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

    /** Sincronização dos dados em nuvem para o repositório local (a cada 24h) */
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
                    : null,
                daysPeriodOverride: null,
            })

            if (!syncRecordsResponse.Success)
                throw new Error(syncRecordsResponse.ErrorMessage)

            await syncDataToLocalDb(syncRecordsResponse.Data)
        } catch (ex) {
            console.error("Houve um erro ao atualizar os dados em nuvem:", (ex as Error).message)
        }
    }

    const syncDataToLocalDb = async (data: ExportUserData): Promise<void> => {
        for (const dreamRecord of data.dreams) {
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
            catch (e) {
                console.log(`Erro ao sincronizar o sonho ${ dreamRecord.title } para o banco local.`)
            }
        }

        for (const sleepRecord of data.sleeps) {
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
            catch (e) {
                console.log(`Erro ao sincronizar o ciclo de sono ${ sleepRecord.date } para o banco local.`)
            }
        }
    }

    const checkIsConnected = (): boolean => {
        return isConnectedRef.current
    }

    const syncCreateDream = async (sleepId: number | null, sleepDateInfo: CreateCompleteDreamModel | null) => {
        try {
            let startDate = ""
            let endDate = ""

            if (sleepId) {
                await db.getFirstAsync<{ date: string }>(`SELECT date FROM sleeps WHERE id = ${ sleepId }`)
                    .then(async (result) => {
                        if (result) {
                            startDate = DateFormatter.forBackend.date(DateTime.fromISO(result.date).toJSDate().getTime())
                            endDate = DateFormatter.forBackend.date(DateTime.fromISO(result.date).plus({ days: 1 }).toJSDate().getTime())
                        }
                    })
            }

            if (sleepDateInfo) {
                if (sleepDateInfo.dreamNoSleepDateKnown) {
                    startDate = DateFormatter.forBackend.date(DateTime.fromJSDate(sleepDateInfo.dreamNoSleepDateKnown.date).minus({ days: 1 }).toJSDate().getTime())
                    endDate = DateFormatter.forBackend.date(DateTime.fromJSDate(sleepDateInfo.dreamNoSleepDateKnown.date).toJSDate().getTime())
                }

                if (sleepDateInfo.dreamNoSleepTimeKnown) {
                    startDate = DateFormatter.forBackend.date(DateTime.fromJSDate(sleepDateInfo.dreamNoSleepTimeKnown.date).minus({ days: 1 }).toJSDate().getTime())
                    endDate = DateFormatter.forBackend.date(DateTime.fromJSDate(sleepDateInfo.dreamNoSleepTimeKnown.date).toJSDate().getTime())
                }
            }

            if (startDate != "" && endDate != "") {
                await UserService.SyncRecords({
                    monthDate: null,
                    daysPeriodOverride: {
                        start: startDate,
                        end: endDate,
                    }
                })
                    .then(async (response) => {
                        if (response.Success)
                            await syncDataToLocalDb(response.Data)
                    })
            }
        }
        catch { }
    }

    const syncCreateSleepCycle = async (model: CreateSleepCycleModel) => {
        try {
            const startDate = DateFormatter.forBackend.date(DateTime.fromJSDate(model.sleepStart).minus({ days: 2 }).toJSDate().getTime())
            await UserService.SyncRecords({
                monthDate: null,
                daysPeriodOverride: {
                    start: startDate,
                    end: DateFormatter.forBackend.date(model.sleepStart.getTime())
                }
            })
                .then(async (response) => {
                    if (response.Success)
                        await syncDataToLocalDb(response.Data)
                })
        }
        catch { }
    }

    const desynchronizeRecord = async (id: number, type: "dream" | "sleep") => {
        try {
            await db.execAsync(`UPDATE ${ type === "dream" ? "dreams" : "sleeps" } SET synchronized = 0 WHERE id = ${ id }`)
        }
        catch { }

        try {
            if (type === "dream") {
                await db.getFirstAsync<DreamDbModel>(`SELECT * FROM dreams WHERE id = ${ id }`)
                    .then(async (result) => {
                        if (result)
                            await syncCreateDream(result.sleepId, null)
                    })
                return
            }

            await db.getFirstAsync<SleepDbModel>(`SELECT * FROM sleeps WHERE id = ${ id }`)
                .then(async (result) => {
                    if (result) {
                        await syncCreateSleepCycle({
                            sleepStart: DateTime.fromISO(result.sleepStart).toJSDate(),
                            sleepEnd: DateTime.fromISO(result.sleepEnd).toJSDate(),
                            wakeUpHumor: {} as any,
                            layDownHumor: {} as any,
                            biologicalOccurences: {} as any,
                            dreams: [],
                        })
                    }
                })
        }
        catch { }
    }

    const deleteRecord = async (id: number, type: "dream" | "sleep") => {
        try {
            await db.execAsync(`DELETE FROM ${ type === "dream" ? "dreams" : "sleeps" } WHERE id = ${ id }`)
        }
        catch { }
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
            syncLocalData,
            syncCreateDream,
            syncCreateSleepCycle,
            desynchronizeRecord,
            deleteRecord,
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