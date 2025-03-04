import { SleepDbModel } from "@/types/sleeps"
import { SQLiteDatabase } from "expo-sqlite"

export default abstract class SleepsDb {
    static async Create(db: SQLiteDatabase, model: SleepDbModel) {
        return await db.execAsync(`
            INSERT INTO sleeps (
                ${ model.id ? "id," : "" }
                date,
                sleepTime,
                sleepStart,
                sleepEnd,
                isNightSleep, 
                wakeUpHumor,
                layDownHumor,
                biologicalOccurences, 
                synchronized
            ) VALUES (
                ${ model.id ? `${ model.id },` : "" }
                '${ model.date }',
                ${ model.sleepTime },
                '${ model.sleepStart }',
                '${ model.sleepEnd }',
                ${ model.isNightSleep ? 1 : 0 }, 
                '${ JSON.stringify(model.wakeUpHumor) }',
                '${ JSON.stringify(model.layDownHumor) }',
                '${ JSON.stringify(model.biologicalOccurences)}', 
                ${ model.synchronized ? 1 : 0 }
            );
        `)
    }

    static async Get(db: SQLiteDatabase, sleepId: number) {
        return await db.getFirstAsync<SleepDbModel>(`SELECT * FROM sleeps WHERE id = ${ sleepId }`)
    }

    static async Update(db: SQLiteDatabase, model: SleepDbModel) {
        await db.execAsync(`
            UPDATE sleeps
            SET 
                date = '${ model.date }',
                sleepTime = ${ model.sleepTime },
                sleepStart = '${ model.sleepStart }',
                sleepEnd = '${ model.sleepEnd }',
                isNightSleep = ${ model.isNightSleep ? 1 : 0 },
                wakeUpHumor = '${ JSON.stringify(model.wakeUpHumor) }',
                layDownHumor = '${ JSON.stringify(model.layDownHumor) }',
                biologicalOccurences = '${ JSON.stringify(model.biologicalOccurences) }',
                synchronized = ${ model.synchronized ? 1 : 0 }
            WHERE id = ${ model.id };
        `)
    }

    static async Delete(db: SQLiteDatabase, sleepId: number) {
        await db.execAsync(`
            DELETE FROM sleeps
            WHERE id = ${ sleepId }
        `)
    }

    static async GetAllNotSyncronized(db: SQLiteDatabase): Promise<SleepDbModel[]> {
        return await db.getAllAsync<SleepDbModel>("SELECT * FROM sleeps WHERE synchronized = 0")
    }

    static async UpdateId(db: SQLiteDatabase, model: SleepDbModel, newId: number) {
        await db.execAsync(`
            UPDATE sleeps
            SET 
                id = ${ newId },
                date = '${ model.date }',
                sleepTime = ${ model.sleepTime },
                sleepStart = '${ model.sleepStart }',
                sleepEnd = '${ model.sleepEnd }',
                isNightSleep = ${ model.isNightSleep ? 1 : 0 },
                wakeUpHumor = '${ JSON.stringify(model.wakeUpHumor) }',
                layDownHumor = '${ JSON.stringify(model.layDownHumor) }',
                biologicalOccurences = '${ JSON.stringify(model.biologicalOccurences) }',
                synchronized = ${ model.synchronized ? 1 : 0 }
            WHERE id = ${ model.id };
        `)
    }
}