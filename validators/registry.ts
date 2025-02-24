import { z } from "./base/validator"

export const registryValidator = z.object({
    fullName: z.string().trim(),
    email: z.string().email().trim(),
    password: z.string().trim(),
})