export type SleepHumorType = {
    undefinedHumor: boolean
    calm: boolean
    drowsiness: boolean
    tiredness: boolean
    anxiety: boolean
    happiness: boolean
    fear: boolean
    sadness: boolean
    other: boolean
}

export const DefaultSleepHumor: SleepHumorType = {
    undefinedHumor: false,
    calm: false,
    drowsiness: false,
    tiredness: false,
    anxiety: false,
    happiness: false,
    fear: false,
    sadness: false,
    other: false,
}