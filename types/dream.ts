import { DreamClimateModel } from "./dreamClimate"

export type DreamListedByUserType = {
    id: number
    title: string
    date: string
    tags: {
        id: number
        title: string
    }[]
}

export type ListDreamsByUserRequest = {
    dreamCaracteristicsFilter: "all" | "allNotHidden" | "allNotErotic" | "allNotHiddenAndErotic" | "allHidden" | "allErotic"
	dreamOriginFilter: "all" | "completeDreams" | "fastDreams" | "importedDreams"
	dreamEspecificCaracteristicsFilter: {
		noEspecificy: boolean
		dreamsWithPersonalAnalysis: boolean | null
		dreamClimates: {
			ameno: boolean | null
			calor: boolean | null
			garoa: boolean | null
			chuva: boolean | null
			tempestade: boolean | null
			nevoa: boolean | null
			neve: boolean | null
			multiplos: boolean | null
			outro: boolean | null
			indefinido: boolean | null
		}
		dreamHourId: number | null
		dreamDurationId: number | null
		dreamLucidityLevelId: number | null
		dreamTypeId: number | null
		dreamRealityLevelId: number | null
		dreamPointOfViewId: number | null
	}
	date: string
}

export type ListDreamByUserResponse = DreamListedByUserType[]

export type GetDreamRequest = {
	id: number
}

export type GetDreamResponse = DreamModel

export type DreamModel = {
	id: number
	title: string
	description: string
	climate: DreamClimateModel
	eroticDream: boolean
	hiddenDream: boolean
	personalAnalysis: string | null
	isComplete: boolean
	createdAt: string
	updatedAt: string
	dreamOriginId: number
	dreamPointOfViewId: number
	dreamHourId: number
	dreamDurationId: number
	dreamLucidityLevelId: number
	dreamTypeId: number
	dreamRealityLevelId: number
	sleepId: number
}

export type CreateDreamModel = {
	sleepId: number | null
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
	personalAnalysis: string | null
	tags: string[]
}

export type CreateCompleteDreamModel = {
	dreamNoSleepDateKnown: DreamNoSleepDateKnownModel | null
	dreamNoSleepTimeKnown: DreamNoSleepTimeKnownModel | null
}

export type DreamNoSleepDateKnownModel = {
	date: Date
	period: DreamNoSleepDateKnownPeriods
}

export type DreamNoSleepDateKnownRequest = {
	date: string
	period: DreamNoSleepDateKnownPeriods
}

export type DreamNoSleepDateKnownPeriods = "morning" | "afternoon" | "night"

export type DreamNoSleepTimeKnownModel = {
	date: Date
	sleepStart: Date
	sleepEnd: Date
}

export type DreamNoSleepTimeKnownRequest = {
	date: string
	sleepStart: string
	sleepEnd: string
}

export type CreateDreamRequest = {
	dreamNoSleepDateKnown: DreamNoSleepDateKnownRequest | null
	dreamNoSleepTimeKnown: DreamNoSleepTimeKnownRequest | null
} & CreateDreamModel

export type CreateDreamResponse = string