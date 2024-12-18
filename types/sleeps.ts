import { PaginationResponse } from "./pagination"

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