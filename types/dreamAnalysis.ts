type DreamAnalysisModel = {
    id: number
    month: number
    year: number
    mostPointOfViewOccurence: number | null
    mostClimateOccurence: string | null
    mostHourOccurence: string | null
    mostDurationOccurence: string | null
    mostLucidityLevelOccurence: string | null
    mostDreamTypeOccurence: string | null
    mostRealityLevelOccurenceOccurence: string | null
    eroticDreamsAverage: number
    tagPerDreamAverage: number
    longestDreamTitle: string
    userId: number
    updatedAt: Date | null
}

type GetDreamAnalysisRequest = {
    date: string
}

type GetDreamAnalysisResponse = DreamAnalysisModel

type CreateDreamAnalysisRequest = {
    date: string
}

type CreateDreamAnalysisResponse = string