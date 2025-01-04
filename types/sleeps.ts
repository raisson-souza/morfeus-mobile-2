import { BiologicalOccurencesType } from "./biologicalOccurences"
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