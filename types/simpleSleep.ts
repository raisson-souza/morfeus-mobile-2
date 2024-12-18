export type SimpleSleepModel = {
    sleepStart: Date | null
	sleepEnd: Date | null
    sleepId: number | null
}

export type CreateSimpleSleepRequest = {
    sleepStart: string
	sleepEnd: string
    sleepId: number | null
}

export type CreateSimpleSleepResponse = string

export type GetSimpleSleepResponse = {
    sleepEnd: Date | null
    sleepStart: Date | null
    sleepId: number | null
}
