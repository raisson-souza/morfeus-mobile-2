import { BiologicalOccurencesType } from "./biologicalOccurences"
import { DreamClimateModel } from "./dreamClimate"
import { PaginationResponse } from "./pagination"
import { SleepHumorType } from "./sleepHumor"

export type ListSleepsForDreamCreationRequest = {
    pageNumber: number
}

export type ListSleepsForDreamCreationResponse = PaginationResponse<ListedSleepForDreamCreation>

export type ListedSleepForDreamCreation = {
    id: number
    date: Date
    sleepStart: string
    sleepEnd: string
}

export type SleepModel = {
    id: number
    date: string
    sleepTime: number
    sleepStart: string
    sleepEnd: string
    isNightSleep: boolean
    wakeUpHumor: SleepHumorType
    layDownHumor: SleepHumorType
    biologicalOccurences: BiologicalOccurencesType
    createdAt: string
    updatedAt: string
    userId: number
}

export type GetSleepRequest = {
    id: number
}

export type GetSleepResponse = SleepModel

export type SleepListedByUserType = {
    id: number
    date: string
    sleepTime: number
    sleepStart: string
    sleepEnd: string
    isNightSleep: boolean
}

export type ListSleepByUserRequest = {
    date: string
}

export type ListSleepByUserResponse = SleepListedByUserType[]

export type DreamInSleepCycleModel = {
    title: string
    description: string
    dreamPointOfViewId: number
    climate: DreamClimateModel
    dreamHourId: number
    dreamDurationId: number
    dreamLucidityLevelId: number
    dreamTypeId: number
    dreamRealityLevelId: number
    eroticDream: boolean
    hiddenDream: boolean
    personalAnalysis?: string
    tags: string[]
}

export type CreateSleepCycleModel = {
    sleepStart: Date
    sleepEnd: Date
    wakeUpHumor: SleepHumorType,
    layDownHumor: SleepHumorType
    biologicalOccurences: BiologicalOccurencesType
    dreams: DreamInSleepCycleModel[]
}

export type CreateSleepCycleRequest = {
    sleepStart: string
    sleepEnd: string
    wakeUpHumor: SleepHumorType,
    layDownHumor: SleepHumorType
    biologicalOccurences: BiologicalOccurencesType
    dreams: DreamInSleepCycleModel[]
}

export type CreateSleepCycleResponse = string

export type DeleteSleepRequest = {
    id: number
}

export type DeleteSleepResponse = string

export type UpdateSleepCycleRequest = {
    id: number
    sleep: CreateSleepCycleRequest
}

export type UpdateSleepCycleResponse = string