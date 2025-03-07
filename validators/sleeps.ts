import { z } from "./base/validator"

export const createSleepCycleValidator = z.object({
    sleepStart: z.date(),
	sleepEnd: z.date(),
	wakeUpHumor: z.object({
		undefinedHumor: z.boolean(),
		calm: z.boolean(),
		drowsiness: z.boolean(),
		tiredness: z.boolean(),
		anxiety: z.boolean(),
		happiness: z.boolean(),
		fear: z.boolean(),
		sadness: z.boolean(),
		other: z.boolean(),
	}),
	layDownHumor: z.object({
		undefinedHumor: z.boolean(),
		calm: z.boolean(),
		drowsiness: z.boolean(),
		tiredness: z.boolean(),
		anxiety: z.boolean(),
		happiness: z.boolean(),
		fear: z.boolean(),
		sadness: z.boolean(),
		other: z.boolean(),
	}),
	biologicalOccurences: z.object({
		sudorese: z.boolean(),
		bruxismo: z.boolean(),
		apneiaDoSono: z.boolean(),
		ronco: z.boolean(),
		movimentosPeriodicosDosMembros: z.boolean(),
		despertaresParciais: z.boolean(),
		refluxoGastroesofagico: z.boolean(),
		sialorreia: z.boolean(),
		arritmias: z.boolean(),
		mioclonia: z.boolean(),
		parassonia: z.boolean(),
		epistaxe: z.boolean(),
		miccaoInvoluntaria: z.boolean(),
		evacuacaoInvoluntaria: z.boolean(),
		polucao: z.boolean(),
	}),
	dreams: z.array(
		z.object({
			title: z.string(),
			description: z.string(),
			dreamPointOfViewId: z.any(),
			climate: z.object({
				ameno: z.boolean(),
				calor: z.boolean(),
				garoa: z.boolean(),
				chuva: z.boolean(),
				tempestade: z.boolean(),
				nevoa: z.boolean(),
				neve: z.boolean(),
				multiplos: z.boolean(),
				outro: z.boolean(),
				indefinido: z.boolean(),
			}),
			dreamHourId: z.any(),
			dreamDurationId: z.any(),
			dreamLucidityLevelId: z.any(),
			dreamTypeId: z.any(),
			dreamRealityLevelId: z.any(),
			eroticDream: z.boolean(),
			hiddenDream: z.boolean(),
			personalAnalysis: z.string().nullish(),
			tags: z.array(z.string()),
		}),
	),
})