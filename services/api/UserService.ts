import { UpdateUserRequest, UpdateUserResponse, UserModel } from "../../types/user"
import Endpoints from "./base/Endpoints"

export default abstract class UserService extends Endpoints {
    static async Update(body: UpdateUserRequest) {
        return await this.Put<UpdateUserResponse>({
            url: "/users",
            authorization: await this.GetAuthorization()
        })
    }

    static async GetUser(id: number) {
        return await this.Get<UserModel>({
            url: `/users/${ id }`,
            authorization: await this.GetAuthorization()
        })
    }
}