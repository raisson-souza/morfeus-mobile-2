import { DateFormatter } from './DateFormatter'
import { Share, Alert } from 'react-native'
import { SleepModel } from '@/types/sleeps'
import env from '@/config/env'
import SleepService from '@/services/api/SleepService'

export type ShareDreamDreamInfoType = "complete" | "titleAndDescription" | "description"

export type ShareDreamSleepCycleInfoType = "complete" | "date" | "nothing"

type ShareDreamProps = {
    dreamInfoType: ShareDreamDreamInfoType
    dreamInfo: {
        title?: string
        description: string
        characteristics?: { title: string; description: string }[]
    }
    tags?: string[]
    personalAnalysis?: string
    sleepId?: number
    sleepCycleInfoType: ShareDreamSleepCycleInfoType
}

export default async function ShareDream({
    dreamInfoType,
    dreamInfo: {
        title,
        description,
        characteristics,
    },
    tags,
    personalAnalysis,
    sleepId,
    sleepCycleInfoType,
}: ShareDreamProps) {
    try {
        let message = `${ env.GooglePlayAppLink() }\nMeu Sonho no Morfeus:\n\n`

        switch (dreamInfoType) {
            case "complete":
                message += `Título: ${ title }\nDescrição:\n${ description }\n\n`
                characteristics!.map(characteristic => {
                    message += `${ characteristic.title }: ${ characteristic.description }\n`
                })
                message += "\n"
                break
            case "titleAndDescription":
                message += `Título: ${ title }\nDescrição:\n${ description }\n\n`
                break
            case "description":
                message += `Descrição:\n${ description }\n\n`
                break
        }

        if (personalAnalysis) {
            message += `Minha Análise Pessoal:\n${ personalAnalysis }\n\n`
        }

        if (tags) {
            message += "Tags: "
            tags.map((tag, i) => {
                message += `${ tag }${ i + 1 === tags.length ? "" : " | "}`
            })
            message += "\n\n"
        }

        let sleep: SleepModel | null = null

        if (sleepCycleInfoType != "nothing" && sleepId) {
            await SleepService.GetSleep(true, { id: sleepId! })
                .then(response => {
                    if (response.Success) {
                        sleep = response.Data
                    }
                })
        }

        if (sleep) {
            const {
                date,
                sleepTime,
                sleepStart,
                sleepEnd,
            } = sleep as SleepModel

            const parsedSleepStart = `${ DateFormatter.removeTime(sleepStart) } - ${ DateFormatter.removeDate(sleepStart) }`
            const parsedSleepEnd = `${ DateFormatter.removeTime(sleepEnd) } - ${ DateFormatter.removeDate(sleepEnd) }`

            switch (sleepCycleInfoType) {
                case "complete":
                    message += `Ciclo de sono referente:\nData: ${ date }\nTempo de sono: ${ sleepTime } horas\n`
                    message += `Momento de ir dormir: ${ parsedSleepStart }\nMomento de acordar: ${ parsedSleepEnd }`
                    break
                case "date":
                    message += `Ciclo de sono referente:\nData: ${ date }\nTempo de sono: ${ sleepTime } horas`
                    break
                case "nothing":
                    break
            }
        }

        await Share.share({
            message: message,
        })
    } catch (error) {
        Alert.alert('Erro ao Compartilhar', `O compartilhamento falhou.\n${ (error as Error).message }`)
    }
}