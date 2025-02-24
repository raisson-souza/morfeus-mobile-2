import { z } from "./base/validator"

export const loginValidator = z.object({
    email: z.string().email().trim(),
    password: z.string().trim(),
})