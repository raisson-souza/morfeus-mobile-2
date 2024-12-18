export type LoginForm = {
    email?: string
    password?: string
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    token: string
    expirationDateMilis: number
    userId: number
}