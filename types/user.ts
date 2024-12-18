import { RegistryRequest } from "./registry"

export type UpdateUserRequest = RegistryRequest

export type UpdateUserResponse = string

/** Model do usuário no backend */
export type UserModel = {
    id: number
    fullName: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
}

/** Dados base do usuário no localStorage para uso em memória */
export type UserDataLocalStorage = {
    id: number
    name: string
    email: string
    password: string
}