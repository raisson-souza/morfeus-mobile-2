import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { DreamListedByUserType, ListDreamByUserResponse, ListDreamsByUserRequest } from "@/types/dream"
import { SQLiteDatabase } from "expo-sqlite"

export default abstract class DreamServiceOffline {
    static async Create() {

    }

    static async ListSleepCycles() {
        
    }

    static async List(db: SQLiteDatabase, request: ListDreamsByUserRequest): Promise<ListDreamByUserResponse> {
        try {
            const formattedDate = DateFormatter.restoreFromBackend.date(request.date)

            const renderDreamCaracteristicsFilter = () => {
                switch (request.dreamCaracteristicsFilter) {
                    case "all":
                        return ""
                    case "allNotHidden":
                        return "d.hiddenDream = FALSE"
                    case "allNotErotic":
                        return "d.eroticDream = FALSE"
                    case "allNotHiddenAndErotic":
                        return "d.hiddenDream = FALSE AND d.eroticDream = FALSE"
                    case "allHidden":
                        return "d.hiddenDream = TRUE"
                    case "allErotic":
                        return "d.eroticDream = TRUE"
                }
            }

            const renderDreamOriginFilter = () => {
                switch (request.dreamOriginFilter) {
                    case "all":
                        return ""
                    case "completeDreams":
                        return "d.dreamOriginId = 1"
                    case "fastDreams":
                        return "d.dreamOriginId = 2"
                    case "importedDreams":
                        return "d.dreamOriginId = 3"
                }
            }

            const dreamCaracteristicsFilter = renderDreamCaracteristicsFilter()
            const dreamOriginFilter  =renderDreamOriginFilter()

            const data = await db.getAllAsync<DreamListedByUserType>(`
                SELECT
                    d.id, d.title, s.date, d.dreamTags as tags
                FROM dreams d
                INNER JOIN sleeps s ON s.id = d.sleepId
                ${
                    dreamCaracteristicsFilter === "" && dreamOriginFilter === ""
                        ? ""
                        : dreamCaracteristicsFilter === "" && dreamOriginFilter != ""
                            ? `WHERE ${ dreamOriginFilter }`
                            : dreamCaracteristicsFilter != "" && dreamOriginFilter === ""
                                ? `WHERE ${ dreamCaracteristicsFilter }`
                                : `WHERE ${ dreamCaracteristicsFilter } AND ${ dreamOriginFilter }`
                }
            `)
                .then(result => {
                    return result.map(dream => {
                        const tags = (dream.tags as any) == 1
                            ? []
                            : JSON.parse(dream.tags as any)
                        return {
                            ...dream,
                            tags: tags.map((tag: any) => {
                                return {
                                    id: 0,
                                    title: tag
                                }
                            })
                        }
                    })
                })

            return data.filter(dream => {
                const dreamDateFormatted = DateTime.fromISO(dream.date)
                return dreamDateFormatted.year === formattedDate.year && dreamDateFormatted.month === formattedDate.month
            })
        }
        catch {
            return []
        }
    }
}