export default function SleepHumorTranslator(humor?: string | null): string {
    if (humor === "anxiety") return "ansiedade"
    if (humor === "calm") return "calmaria"
    if (humor === "drowsiness") return "sonolência"
    if (humor === "fear") return "medo"
    if (humor === "happiness") return "felicidade"
    if (humor === "other") return "outro"
    if (humor === "sadness") return "tristeza"
    if (humor === "tiredness") return "cansaço"
    if (humor === "undefinedHumor") return "indefinido"
    else return ""
}