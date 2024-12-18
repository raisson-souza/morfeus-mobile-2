import { z } from "./base/validator"

export const registryValidator = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string().trim(),
})