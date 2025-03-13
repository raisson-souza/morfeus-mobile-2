import { CreateDreamRequest, DreamListedByUserType, DreamModel, ListDreamByUserResponse, ListDreamsByUserRequest, UpdateDreamRequest } from "@/types/dream"
import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { DefaultDreamClimate } from "@/types/dreamClimate"
import { ListedSleepForDreamCreation, ListSleepsForDreamCreationRequest } from "@/types/sleeps"
import { PaginationResponse } from "@/types/pagination"
import { SQLiteDatabase } from "expo-sqlite"
import DreamsDb from "@/db/dreamsDb"

// CICLO DE SONO AO SER SINCRONIZADO VOLTA UM DIA NA DATA

export default abstract class DreamServiceOffline {
    static async Create(db: SQLiteDatabase, request: CreateDreamRequest): Promise<void> {
        await db.getFirstAsync<{ id: number }>(`SELECT id FROM sleeps WHERE id = ${ request.sleepId }`)
            .then(result => {
                if (!result)
                    throw new Error("O ciclo de sono referente não existe.")
            })

        await db.getFirstAsync<{ title: string }>(`SELECT title FROM dreams WHERE title = '${ request.title }'`)
            .then(result => {
                if (result)
                    throw new Error("Já existe um sonho no sistema com o mesmo nome, por favor, escolha outro.")
            })

        this.validateForeignKeys(request)

        try {
            await DreamsDb.Create(db, {
                ...request,
                personalAnalysis: request.personalAnalysis,
                isComplete: true,
                sleepId: request.sleepId!,
                synchronized: false,
                dreamTags: request.tags,
                dreamOriginId: 1,
            })
        }
        catch { }
    }

    static async Update(db: SQLiteDatabase, request: UpdateDreamRequest): Promise<void> {
        await db.getFirstAsync<{ id: number }>(`SELECT id FROM dreams WHERE id = ${ request.id }`)
            .then(result => {
                if (!result)
                    throw new Error("Sonho inexistente.")
            })

        await db.getFirstAsync<{ id: number }>(`SELECT id FROM sleeps WHERE id = ${ request.sleepId }`)
            .then(result => {
                if (!result)
                    throw new Error("O ciclo de sono referente não existe.")
            })

        this.validateForeignKeys(request)

        try {
            await DreamsDb.Update(db, {
                ...request,
                personalAnalysis: request.personalAnalysis,
                isComplete: true,
                sleepId: request.sleepId!,
                synchronized: false,
                dreamTags: request.tags,
                dreamOriginId: 1,
            })
        }
        catch { }
    }

    private static validateForeignKeys(request: CreateDreamRequest | UpdateDreamRequest): void {
        if (request.dreamPointOfViewId <= 0 || request.dreamPointOfViewId > 3)
            throw new Error("Ponto de vista inválido.")
        if (request.dreamHourId <= 0 || request.dreamHourId > 6)
            throw new Error("Horário do sonho inválido.")
        if (request.dreamDurationId <= 0 || request.dreamDurationId > 4)
            throw new Error("Duração de sonho inválida.")
        if (request.dreamLucidityLevelId <= 0 || request.dreamLucidityLevelId > 4)
            throw new Error("Nível de lucidez inválido.")
        if (request.dreamTypeId <= 0 || request.dreamTypeId > 3)
            throw new Error("Tipo de sonho inválido.")
        if (request.dreamRealityLevelId <= 0 || request.dreamRealityLevelId > 3)
            throw new Error("Nível de realidade inválido.")
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

    static async List(db: SQLiteDatabase, request: ListDreamsByUserRequest, onlyNotSynchronized: boolean = false): Promise<ListDreamByUserResponse> {
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
            const dreamOriginFilter = renderDreamOriginFilter()
            const syncWhereQuery = onlyNotSynchronized ? "d.synchronized = 0" : null

            const data = await db.getAllAsync<DreamListedByUserType>(`
                SELECT
                    d.id, d.title, s.date, d.dreamTags as tags
                FROM dreams d
                INNER JOIN sleeps s ON s.id = d.sleepId
                ${
                    dreamCaracteristicsFilter === "" && dreamOriginFilter === ""
                        ? syncWhereQuery ? `WHERE ${ syncWhereQuery }` : ""
                        : dreamCaracteristicsFilter === "" && dreamOriginFilter != ""
                            ? `WHERE ${ dreamOriginFilter } ${ syncWhereQuery ? `AND ${ syncWhereQuery }` : "" }`
                            : dreamCaracteristicsFilter != "" && dreamOriginFilter === ""
                                ? `WHERE ${ dreamCaracteristicsFilter } ${ syncWhereQuery ? `AND ${ syncWhereQuery }` : "" }`
                                : `WHERE ${ dreamCaracteristicsFilter } AND ${ dreamOriginFilter } ${ syncWhereQuery ? `AND ${ syncWhereQuery }` : "" }`
                }
            `)
                .then(result => {
                    const dreams: DreamListedByUserType[] = []
                    for (const dream of result) {
                        try {
                            const parsedTags = DreamsDb.FixDreamTags(dream.tags)
                            dreams.push({
                                ...dream,
                                tags: parsedTags.map(tag => {
                                    return {
                                        id: 0,
                                        title: tag,
                                    }
                                })
                            })
                        }
                        catch (e) { console.log((e as Error).message)}
                    }
                    return dreams
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