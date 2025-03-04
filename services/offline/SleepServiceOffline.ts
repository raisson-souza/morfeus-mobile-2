import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { ListSleepByUserRequest, ListSleepByUserResponse, SleepListedByUserType } from "@/types/sleeps"
import { SQLiteDatabase } from "expo-sqlite"

export default abstract class SleepServiceOffline {
    static async Create() {

    }

    static async GetDreams() {
        
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
}