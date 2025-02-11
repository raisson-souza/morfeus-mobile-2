import { CheckAccountRecoveryRequest, CheckAccountRecoveryResponse, CreateAccountRecoveryRequest, CreateAccountRecoveryResponse, FinishAccountRecoveryRequest, FinishAccountRecoveryResponse, UpdateUserRequest, UpdateUserResponse, UserDataDeletionResponse, UserModel } from "../../types/user"
import Endpoints from "./base/Endpoints"

export default abstract class UserService extends Endpoints {
    static async Update(request: UpdateUserRequest) {
        return await this.Put<UpdateUserResponse>({
            url: "/users",
            body: request,
            authorization: await this.GetAuthorization(),
        })
    }

    static async GetUser(id: number) {
        return await this.Get<UserModel>({
            url: `/users/${ id }`,
            authorization: await this.GetAuthorization()
        })
    }

    static async DataDeletion() {
        return await this.Post<UserDataDeletionResponse>({
            url: `/users/data_deletion`,
            authorization: await this.GetAuthorization(),
        })
    }

    static async CreateAccountRecovery(request: CreateAccountRecoveryRequest) {
        return await this.Post<CreateAccountRecoveryResponse>({
            url: `/users/account_recovery/${ request.email }`,
            authorization: await this.GetAuthorization(),
        })
    }

    static async CheckAccountRecovery(request: CheckAccountRecoveryRequest) {
        return await this.Get<CheckAccountRecoveryResponse>({
            url: `/users/account_recovery/${ request.code }`,
            authorization: await this.GetAuthorization(),
        })
    }

    static async FinishAccountRecovery(request: FinishAccountRecoveryRequest) {
        return await this.Post<FinishAccountRecoveryResponse>({
            url: `/users/account_recovery/finish`,
            body: request,
            authorization: await this.GetAuthorization(),
        })
    }
}