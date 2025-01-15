export type SleepAnalysisModel = {
    id: number
    month: number
    year: number
    dreamsCount: number
    goodWakeUpHumorPercentage: number
    badWakeUpHumorPercentage: number
    goodLayDownHumorPercentage: number
    badLayDownHumorPercentage: number
    mostFrequentWakeUpHumor: string | null
    leastFrequentWakeUpHumor: string | null
    mostFrequentLayDownHumor: string | null
    leastFrequentLayDownHumor: string | null
    mostFrequentBiologicalOccurence: string | null
    leastFrequentBiologicalOccurence: string | null
    mostSleepDuration: number
    leastSleepDuration: number
    averageDreamPerSleep: number
    sleepDurationAverage: number
    mostDreamsPerSleepDate: string | null
    userId: number
    updatedAt: Date | null
}

export type GetSleepAnalysisRequest = {
    date: string
}

export type GetSleepAnalysisResponse = SleepAnalysisModel

export type CreateSleepAnalysisRequest = {
    date: string
}

export type CreateSleepAnalysisResponse = string