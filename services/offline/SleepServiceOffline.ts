import { CreateSleepCycleRequest, ListSleepByUserRequest, ListSleepByUserResponse, SleepDbModel, SleepListedByUserType, SleepModel, SlepPeriodsEpoch } from "@/types/sleeps"
import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { ListedDreamBySleepCycle } from "@/types/dream"
import { SQLiteDatabase } from "expo-sqlite"
import DreamsDb from "@/db/dreamsDb"
import DreamServiceOffline from "./DreamServiceOffline"
import SleepsDb from "@/db/sleepsDb"

export default abstract class SleepServiceOffline {
    static async Create(db: SQLiteDatabase, request: CreateSleepCycleRequest): Promise<void> {
        const sleepStart = DateFormatter.restoreFromBackend.dateTime(request.sleepStart)
        const sleepEnd = DateFormatter.restoreFromBackend.dateTime(request.sleepEnd)

        if (sleepEnd < sleepStart)
            throw new Error("Horários de ir dormir e acordar inválidos.")

        if (sleepEnd.diff(sleepStart, "hours").hours > 24)
            throw new Error("Intervalo de sono inválido.")

        const date = sleepStart.day != sleepEnd.day
            ? sleepStart.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            : sleepStart.hour >= 0 && sleepStart.hour < 12
                ? sleepStart.minus({ days: 1 }).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                : sleepStart.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

        const sleepTime = (sleepEnd.toMillis() - sleepStart.toMillis()) / (1000 * 60 * 60)

        const isNightSleep = sleepStart.day != sleepEnd.day || (sleepStart.hour >= 18 || (sleepStart.hour >= 0 && sleepStart.hour < 12))

        const sleepCyclesDateConflitcts = await db.getAllAsync<SleepDbModel>(`SELECT * FROM sleeps WHERE date = '${ date.toISO() }'`)

        sleepCyclesDateConflitcts.map(sleepCycleDateConflit => {
            const hasConflict = SleepServiceOffline.checkSleepPeriod(
                {
                    sleepStart: sleepStart.toMillis(),
                    sleepEnd: sleepEnd.toMillis(),
                },
                {
                    sleepStart: DateTime.fromISO(sleepCycleDateConflit.sleepStart).toMillis(),
                    sleepEnd: DateTime.fromISO(sleepCycleDateConflit.sleepStart).toMillis(),
                }
            )
            if (hasConflict)
                throw new Error("Já existe um ciclo de sono cadastrado neste mesmo período.")
        })

        await SleepsDb.Create(db, {
            date: date.toISO()!,
            sleepTime: sleepTime,
            sleepStart: `${ request.sleepStart.split(" ")[0].replaceAll("/", "-") }T${ request.sleepStart.split(" ")[1] }.000-03:00`,
            sleepEnd: `${ request.sleepEnd.split(" ")[0].replaceAll("/", "-") }T${ request.sleepEnd.split(" ")[1] }.000-03:00`,
            isNightSleep: isNightSleep,
            wakeUpHumor: request.wakeUpHumor,
            layDownHumor: request.layDownHumor,
            biologicalOccurences: request.biologicalOccurences,
            synchronized: false,
        })

        const sleepId = await db.getFirstAsync<{ id: number }>(`SELECT id FROM sleeps ORDER BY createdAt DESC LIMIT 1`)
            .then(result => result ? result.id : null)

        if (!sleepId)
            throw new Error("Ocorreu um erro desconhecido ao criar o ciclo de sono.")

        for (const dream of request.dreams) {
            try {
                await DreamServiceOffline.Create(db,
                    {
                        sleepId: sleepId,
                        title: dream.title,
                        description: dream.description,
                        dreamPointOfViewId: dream.dreamPointOfViewId,
                        climate: dream.climate,
                        dreamHourId: dream.dreamHourId,
                        dreamDurationId: dream.dreamDurationId,
                        dreamLucidityLevelId: dream.dreamLucidityLevelId,
                        dreamTypeId: dream.dreamTypeId,
                        dreamRealityLevelId: dream.dreamRealityLevelId,
                        eroticDream: dream.eroticDream,
                        hiddenDream: dream.hiddenDream,
                        personalAnalysis: dream.personalAnalysis ?? null,
                        tags: dream.tags,
                        dreamNoSleepDateKnown: null,
                        dreamNoSleepTimeKnown: null,
                    }
                )
            }
            catch { }
        }
    }

    static async GetDreams(db: SQLiteDatabase, sleepId: number): Promise<ListedDreamBySleepCycle[]> {
        try {
            return await db.getAllAsync<{
                id: number,
                title: string,
                eroticDream: boolean,
                hiddenDream: boolean,
                dreamTags: string
            }>(`SELECT id, title, eroticDream, hiddenDream, dreamTags FROM dreams WHERE sleepId = ${ sleepId }`)
                .then(result => {
                    return result.map(dream => {
                        return {
                            id: dream.id,
                            title: dream.title,
                            tags: DreamsDb.FixDreamTags(dream.dreamTags as any),
                            isHiddenOrErotic: dream.eroticDream || dream.hiddenDream,
                        }
                    })
                })
        }
        catch {
            return []
        }
    }

    static async List(db: SQLiteDatabase, request: ListSleepByUserRequest): Promise<ListSleepByUserResponse> {
        try {
            const formattedDate = DateFormatter.restoreFromBackend.date(request.date)

            const data = await db.getAllAsync<SleepListedByUserType>(`
                SELECT
                    id, date, sleepTime, sleepStart, sleepEnd, isNightSleep
                FROM sleeps
            `)

            return data.filter(sleep => {
                const sleepDateFormatted = DateTime.fromISO(sleep.date)
                return sleepDateFormatted.year === formattedDate.year && sleepDateFormatted.month === formattedDate.month
            })
        }
        catch {
            return []
        }
    }

    static async CheckIsSynchronized(db: SQLiteDatabase, id: number): Promise<boolean> {
        return await db.getFirstAsync<{ synchronized: boolean }>(`SELECT synchronized FROM sleeps WHERE id = ${ id }`)
            .then(result => result ? result.synchronized : false)
    }

    private static checkSleepPeriod(dbSleepPeriods: SlepPeriodsEpoch, newSleepPeriods: SlepPeriodsEpoch): boolean {
        return (
            // o novo sono inicia antes do inicio sono e termina antes do fim
            (
                dbSleepPeriods.sleepStart >= newSleepPeriods.sleepStart &&
                dbSleepPeriods.sleepStart <= newSleepPeriods.sleepEnd &&
                dbSleepPeriods.sleepEnd >= newSleepPeriods.sleepEnd
            ) ||
            // o novo sono inicia após o inicio do sono e termina antes do fim
            (
                dbSleepPeriods.sleepStart >= newSleepPeriods.sleepStart &&
                dbSleepPeriods.sleepEnd <= newSleepPeriods.sleepEnd
            ) ||
            // o novo sono inicia antes do inicio do sono e termina após o fim
            (
                dbSleepPeriods.sleepStart <= newSleepPeriods.sleepStart &&
                dbSleepPeriods.sleepEnd >= newSleepPeriods.sleepEnd
            ) ||
            // o novo sono inicia após o inicio do sono e termina após o fim
            (
                dbSleepPeriods.sleepStart <= newSleepPeriods.sleepStart &&
                dbSleepPeriods.sleepEnd >= newSleepPeriods.sleepStart &&
                dbSleepPeriods.sleepEnd <= newSleepPeriods.sleepEnd
            )
        )
    }
}