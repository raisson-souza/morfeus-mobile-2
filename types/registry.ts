export type RegistryForm = {
    fullName?: string
    email?: string
    password?: string
    passwordRepeat?: string
}

export type RegistryRequest = {
    fullName: string
    email: string
    password: string
}

export type RegistryResponse = string