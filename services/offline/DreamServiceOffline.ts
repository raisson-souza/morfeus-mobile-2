import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { DefaultDreamClimate } from "@/types/dreamClimate"
import { DreamListedByUserType, DreamModel, ListDreamByUserResponse, ListDreamsByUserRequest } from "@/types/dream"
import { ListedSleepForDreamCreation, ListSleepsForDreamCreationRequest } from "@/types/sleeps"
import { PaginationResponse } from "@/types/pagination"
import { SQLiteDatabase } from "expo-sqlite"
import DreamsDb from "@/db/dreamsDb"

export default abstract class DreamServiceOffline {
    static async Create() {

    }

    static async ListSleepCycles(db: SQLiteDatabase, request: ListSleepsForDreamCreationRequest): Promise<PaginationResponse<ListedSleepForDreamCreation>> {
        try {
            const total = await db.getFirstAsync<{ count: number }>("SELECT COUNT(id) as count FROM sleeps").then(result => result ? result.count : 0)
            return await db.getAllAsync<ListedSleepForDreamCreation>(`SELECT id, date, sleepStart, sleepEnd FROM sleeps ORDER BY date DESC LIMIT 5 OFFSET ${ (request.pageNumber - 1) * 5 }`)
                .then(result => {
                    return {
                        data: result.map(sleepCycle => {
                            return {
                                ...sleepCycle,
                                // horário tratado
                                date: DateFormatter.removeTime(sleepCycle.date as any) as any
                            }
                        }),
                        meta: {
                            currentPage: request.pageNumber,
                            firstPage: 1,
                            firstPageUrl: "",
                            lastPage: (request.pageNumber * 5) < total ? request.pageNumber + 1 : request.pageNumber,
                            lastPageUrl: "",
                            nextPageUrl: "",
                            perPage: 5,
                            previousPageUrl: "",
                            total: total,
                        },
                    }
                })
        }
        catch {
            return {
                data: [],
                meta: {
                    currentPage: request.pageNumber,
                    firstPage: 1,
                    firstPageUrl: "",
                    lastPage: 1,
                    lastPageUrl: "",
                    nextPageUrl: "",
                    perPage: 5,
                    previousPageUrl: "",
                    total: 1,
                },
            }
        }
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

    static async CheckIsSynchronized(db: SQLiteDatabase, id: number): Promise<boolean> {
        return await db.getFirstAsync<{ synchronized: boolean }>(`SELECT synchronized FROM dreams WHERE id = ${ id }`)
            .then(result => result ? result.synchronized : false)
    }

    static async ListDreamsByTag(db: SQLiteDatabase, tagTitle: string): Promise<DreamModel[]> { // ListDreamsByTag retorna DreamModel pois é requerido em getTag
        try {
            return await db.getAllAsync<{ id: number, title: string, dreamTags: string }>(`SELECT id, title, dreamTags FROM dreams`)
                .then(result => {
                    const dreams: DreamModel[] = []

                    for (const dream of result) {
                        try {
                            if (dream.dreamTags === "1" || dream.dreamTags === "[]") continue

                            const parsedTags = DreamsDb.FixDreamTags(dream.dreamTags)
                            parsedTags.map(tag => {
                                if (tag == tagTitle) {
                                    dreams.push({
                                        id: dream.id,
                                        title: dream.title,
                                        description: "",
                                        climate: DefaultDreamClimate,
                                        eroticDream: false,
                                        hiddenDream: false,
                                        personalAnalysis: "",
                                        isComplete: true,
                                        createdAt: "",
                                        updatedAt: "",
                                        dreamOriginId: 0,
                                        dreamPointOfViewId: 0,
                                        dreamHourId: 0,
                                        dreamDurationId: 0,
                                        dreamLucidityLevelId: 0,
                                        dreamTypeId: 0,
                                        dreamRealityLevelId: 0,
                                        sleepId: 0,
                                        synchronized: true,
                                        dreamTags: [],
                                    })
                                }
                            })
                        }
                        catch { }
                    }

                    return dreams
                })
        }
        catch {
            return []
        }
    }
}