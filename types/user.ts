import { ExportUserData } from "./userData"
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

export type UserPresentationModel = {
    id: number
    fullName: string
    email: string
    password: string
}

export type UserDataDeletionResponse = string

export type CreateAccountRecoveryRequest = {
    email: string
}

export type CreateAccountRecoveryResponse = string

export type CheckAccountRecoveryRequest = {
    code: string
}

export type CheckAccountRecoveryResponse = string

export type FinishAccountRecoveryRequest = {
    code: string
    email: string
    password: string
}

export type FinishAccountRecoveryResponse = string

export type ExportUserDataRequest = {
    startDate: string
    endDate: string
}

export type ExportUserDataResponse = ExportUserData

export type ImportUserDataRequest = {
    isSameOriginImport: boolean
    dreamsPath: string | null
    fileContent: string
    sendEmailOnFinish: boolean
}

export type ImportUserDataResponse = string

export type SyncRecordsRequest = {
    monthDate: string | null
    daysPeriodOverride: {
        start: string
        end: string
    } | null
}

export type SyncRecordsResponse = ExportUserDataResponse

export type CheckSynchronizedRecordRequest = {
    dreamTitle: string | null
    sleepCycle: {
        date: string
        sleepStart: string
        sleepEnd: string
    } | null
}

export type CheckSynchronizedRecordResponse = number