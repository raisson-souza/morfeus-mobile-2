import { BiologicalOccurencesType } from "./biologicalOccurences"
import { DreamClimateModel } from "./dreamClimate"
import { SleepHumorType } from "./sleepHumor"

export type ExportUserDataSleeps = {
    id: number
    date: string
    sleepTime: number
    sleepStart: string
    sleepEnd: string
    isNightSleep: boolean
    wakeUpHumor: SleepHumorType
    layDownHumor: SleepHumorType
    biologicalOccurences: BiologicalOccurencesType
}

export type ExportUserDataDreams = {
    id: number
    title: string
    description:  string
    climate: DreamClimateModel
    eroticDream: boolean
    hiddenDream: boolean
    personalAnalysis:  string | null
    dreamOriginId: number
    dreamPointOfViewId: number
    dreamHourId: number
    dreamDurationId: number
    dreamLucidityLevelId: number
    dreamTypeId: number
    dreamRealityLevelId: number
    sleepId: number
    dreamTags: string[]
}

export type ExportUserData = {
    sleeps: ExportUserDataSleeps[]
    dreams: ExportUserDataDreams[]
}