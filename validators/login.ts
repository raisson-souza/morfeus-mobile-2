import { z } from "./base/validator"

export const loginValidator = z.object({
    email: z.string().email(),
    password: z.string().trim(),
})