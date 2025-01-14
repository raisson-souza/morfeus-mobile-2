type DreamAnalysisModel = {
    id: number
    month: number
    year: number
    mostPointOfViewOccurence: number
    mostClimateOccurence: string
    mostHourOccurence: string
    mostDurationOccurence: string
    mostLucidityLevelOccurence: string
    mostDreamTypeOccurence: string
    mostRealityLevelOccurenceOccurence: string
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