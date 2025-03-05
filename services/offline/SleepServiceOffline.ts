import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { ListedDreamBySleepCycle } from "@/types/dream"
import { ListSleepByUserRequest, ListSleepByUserResponse, SleepListedByUserType } from "@/types/sleeps"
import { SQLiteDatabase } from "expo-sqlite"
import DreamsDb from "@/db/dreamsDb"

export default abstract class SleepServiceOffline {
    static async Create() {

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
}