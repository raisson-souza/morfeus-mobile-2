import { z } from "./base/validator"

export const createDreamValidator = z.object({
    sleepId: z.number().nullable(),
    title: z.string(),
    description: z.string(),
    dreamPointOfViewId: z.number(),
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
    dreamHourId: z.number(),
    dreamDurationId: z.number(),
    dreamLucidityLevelId: z.number(),
    dreamTypeId: z.number(),
    dreamRealityLevelId: z.number(),
    eroticDream: z.boolean(),
    hiddenDream: z.boolean(),
    personalAnalysis: z.string().nullable(),
    tags: z.array(z.string()),
    dreamNoSleepDateKnown: z.object({
        date: z.string(),
        period: z.string(),
    }).nullable(),
    dreamNoSleepTimeKnown: z.object({
        date: z.string(),
        sleepStart: z.string(),
        sleepEnd: z.string(),
    }).nullable(),
})