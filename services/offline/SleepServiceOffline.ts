import { CreateSleepCycleRequest, ListSleepByUserRequest, ListSleepByUserResponse, SleepDbModel, SleepListedByUserType, SlepPeriodsEpoch, UpdateSleepCycleRequest } from "@/types/sleeps"
import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { ListedDreamBySleepCycle } from "@/types/dream"
import { SQLiteDatabase } from "expo-sqlite"
import DreamsDb from "@/db/dreamsDb"
import DreamServiceOffline from "./DreamServiceOffline"
import SleepsDb from "@/db/sleepsDb"

export default abstract class SleepServiceOffline {
    static async Create(db: SQLiteDatabase, request: CreateSleepCycleRequest): Promise<void> {
        const sleepStart = DateFormatter.restoreFromBackend.dateTime(request.sleepStart) as DateTime<true>
        const sleepEnd = DateFormatter.restoreFromBackend.dateTime(request.sleepEnd) as DateTime<true>

        this.verifySleepPeriod(sleepStart, sleepEnd)

        const date = this.defineSleepCycleDate(sleepStart, sleepEnd)

        const sleepTime = this.defineSleepCycleTime(sleepStart.toMillis(), sleepEnd.toMillis())

        const isNightSleep = this.isNightSleep(sleepStart, sleepEnd)

        await this.verifySleepCycleConflicts(
            db,
            date.toISODate(),
            sleepStart.toMillis(),
            sleepEnd.toMillis(),
        )

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

    static async Update(db: SQLiteDatabase, request: UpdateSleepCycleRequest): Promise<void> {
        const sleepExists = await SleepsDb.Get(db, request.id)
            .then(result => result != null)

        if (!sleepExists)
            throw new Error("Ciclo de sono não encontrado.")

        const sleepStart = DateFormatter.restoreFromBackend.dateTime(request.sleep.sleepStart) as DateTime<true>
        const sleepEnd = DateFormatter.restoreFromBackend.dateTime(request.sleep.sleepEnd) as DateTime<true>

        this.verifySleepPeriod(sleepStart, sleepEnd)

        const date = this.defineSleepCycleDate(sleepStart, sleepEnd)

        const sleepTime = this.defineSleepCycleTime(sleepStart.toMillis(), sleepEnd.toMillis())

        const isNightSleep = this.isNightSleep(sleepStart, sleepEnd)

        await this.verifySleepCycleConflicts(
            db,
            date.toISODate(),
            sleepStart.toMillis(),
            sleepEnd.toMillis(),
            request.id,
        )

        await SleepsDb.Update(db, {
            date: date.toISO()!,
            sleepTime: sleepTime,
            sleepStart: `${ request.sleep.sleepStart.split(" ")[0].replaceAll("/", "-") }T${ request.sleep.sleepStart.split(" ")[1] }.000-03:00`,
            sleepEnd: `${ request.sleep.sleepEnd.split(" ")[0].replaceAll("/", "-") }T${ request.sleep.sleepEnd.split(" ")[1] }.000-03:00`,
            isNightSleep: isNightSleep,
            wakeUpHumor: request.sleep.wakeUpHumor,
            layDownHumor: request.sleep.layDownHumor,
            biologicalOccurences: request.sleep.biologicalOccurences,
            synchronized: false,
        })
    }

    private static defineSleepCycleDate(sleepStart: DateTime<true>, sleepEnd: DateTime<true>): DateTime<true> {
        return sleepStart.day != sleepEnd.day
            ? sleepStart.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            : sleepStart.hour >= 0 && sleepStart.hour < 12
                ? sleepStart.minus({ days: 1 }).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                : sleepStart.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    }

    private static async verifySleepCycleConflicts(
        db: SQLiteDatabase,
        dateIso: string,
        sleepStartMilis: number,
        sleepEndMilis: number,
        sleepId?: number,
    ): Promise<void> {
        const sleepCyclesDateConflitcts = await db.getAllAsync<SleepDbModel>(`SELECT * FROM sleeps WHERE date = '${ dateIso }'`)

        sleepCyclesDateConflitcts.map(sleepCycleDateConflit => {
            const { hasConflict, isSameId } = SleepServiceOffline.checkSleepPeriod(
                {
                    sleepStart: sleepStartMilis,
                    sleepEnd: sleepEndMilis,
                    id: sleepCycleDateConflit.id,
                },
                {
                    sleepStart: DateTime.fromISO(sleepCycleDateConflit.sleepStart).toMillis(),
                    sleepEnd: DateTime.fromISO(sleepCycleDateConflit.sleepStart).toMillis(),
                    id: sleepId,
                },
            )

            if (hasConflict && !isSameId)
                throw new Error("Já existe um ciclo de sono cadastrado neste mesmo período.")
        })
    }

    private static isNightSleep(sleepStart: DateTime<true>, sleepEnd: DateTime<true>): boolean {
        return sleepStart.day != sleepEnd.day || (sleepStart.hour >= 18 || (sleepStart.hour >= 0 && sleepStart.hour < 12))
    }

    private static defineSleepCycleTime(sleepStartMilis: number, sleepEndMilis: number): number {
        return (sleepEndMilis - sleepStartMilis) / (1000 * 60 * 60)
    }

    private static verifySleepPeriod(sleepStart: DateTime<true>, sleepEnd: DateTime<true>): void {
        if (sleepEnd < sleepStart)
            throw new Error("Horários de ir dormir e acordar inválidos.")

        if (sleepEnd.diff(sleepStart, "hours").hours > 24)
            throw new Error("Intervalo de sono inválido.")
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

    private static checkSleepPeriod(dbSleepPeriods: SlepPeriodsEpoch, newSleepPeriods: SlepPeriodsEpoch)
    : { hasConflict: boolean, isSameId: boolean } {
        return {
            hasConflict: (
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
            ),
            isSameId: dbSleepPeriods.id || newSleepPeriods.id
                ? dbSleepPeriods.id === newSleepPeriods.id
                : false,
        }
    }
}