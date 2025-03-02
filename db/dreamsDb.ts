import { DreamDbModel, DreamModel } from "@/types/dream"
import { SQLiteDatabase } from "expo-sqlite"

export default abstract class DreamsDb {
    static async Create(db: SQLiteDatabase, model: DreamDbModel) {
        return await db.execAsync(`
            INSERT INTO dreams (
                ${ model.id ? "id," : "" }
                title,
                description,
                climate,
                eroticDream,
                hiddenDream,
                personalAnalysis, 
                isComplete,
                dreamOriginId,
                dreamPointOfViewId, 
                dreamHourId,
                dreamDurationId,
                dreamLucidityLevelId,
                dreamTypeId, 
                dreamRealityLevelId,
                sleepId,
                dreamTags,
                synchronized
            ) VALUES (
                ${ model.id ? `${ model.id },` : "" }
                '${ model.title }',
                '${ model.description }', 
                '${ JSON.stringify(model.climate) }',
                ${ model.eroticDream ? 1 : 0 },
                ${ model.hiddenDream ? 1 : 0 },
                '${ model.personalAnalysis }', 
                ${ model.isComplete ? 1 : 0 },
                ${ model.dreamOriginId },
                ${ model.dreamPointOfViewId }, 
                ${ model.dreamHourId },
                ${ model.dreamDurationId },
                ${ model.dreamLucidityLevelId }, 
                ${ model.dreamTypeId },
                ${ model.dreamRealityLevelId },
                ${ model.sleepId },
                ${ model.synchronized ? 1 : 0 },
                '${ model.dreamTags ? JSON.stringify(model.dreamTags) : '' }'
            )
        `)
    }

    static async Get(db: SQLiteDatabase, dreamId: number) {
        return await db.getFirstAsync<DreamModel>(`SELECT * FROM dreams WHERE id = ${ dreamId }`)
    }

    static async Update(db: SQLiteDatabase, model: DreamDbModel) {
        await db.execAsync(`
            UPDATE dreams
            SET
                title = '${ model.title }',
                description = '${ model.description }',
                climate = '${ JSON.stringify(model.climate) }',
                eroticDream = ${ model.eroticDream ? 1 : 0 },
                hiddenDream = ${ model.hiddenDream ? 1 : 0 },
                personalAnalysis = '${ model.personalAnalysis }',
                isComplete = ${ model.isComplete ? 1 : 0 },
                dreamOriginId = ${ model.dreamOriginId },
                dreamPointOfViewId = ${ model.dreamPointOfViewId },
                dreamHourId = ${ model.dreamHourId },
                dreamDurationId = ${ model.dreamDurationId },
                dreamLucidityLevelId = ${ model.dreamLucidityLevelId },
                dreamTypeId = ${ model.dreamTypeId },
                dreamRealityLevelId = ${ model.dreamRealityLevelId },
                sleepId = ${ model.sleepId },
                synchronized = ${ model.synchronized ? 1 : 0 },
                dreamTags = '${ model.dreamTags ? JSON.stringify(model.dreamTags) : "" }'
            WHERE id = ${ model.id }
        `)
    }

    static async Delete(db: SQLiteDatabase, dreamId: number) {
        await db.execAsync(`
            DELETE FROM dreams
            WHERE id = ${ dreamId }
        `)
    }

    static async GetAllNotSyncronized(db: SQLiteDatabase) {
        return await db.getAllAsync<DreamDbModel>("SELECT * FROM dreams WHERE synchronized = 0")
    }

    static async UpdateId(db: SQLiteDatabase, model: DreamDbModel, newId: number) {
        await db.execAsync(`
            UPDATE dreams
            SET
                id = ${ newId },
                title = '${ model.title }',
                description = '${ model.description }',
                climate = '${ JSON.stringify(model.climate) }',
                eroticDream = ${ model.eroticDream ? 1 : 0 },
                hiddenDream = ${ model.hiddenDream ? 1 : 0 },
                personalAnalysis = '${ model.personalAnalysis }',
                isComplete = ${ model.isComplete ? 1 : 0 },
                dreamOriginId = ${ model.dreamOriginId },
                dreamPointOfViewId = ${ model.dreamPointOfViewId },
                dreamHourId = ${ model.dreamHourId },
                dreamDurationId = ${ model.dreamDurationId },
                dreamLucidityLevelId = ${ model.dreamLucidityLevelId },
                dreamTypeId = ${ model.dreamTypeId },
                dreamRealityLevelId = ${ model.dreamRealityLevelId },
                sleepId = ${ model.sleepId },
                synchronized = ${ model.synchronized ? 1 : 0 },
                dreamTags = '${ model.dreamTags ? JSON.stringify(model.dreamTags) : "" }'
            WHERE id = ${ model.id }
        `)
    }
}