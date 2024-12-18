import { LoginRequest, LoginResponse } from "../../types/login"
import { RegistryRequest, RegistryResponse } from "../../types/registry"
import Endpoints from "./base/Endpoints"

export default abstract class AuthService extends Endpoints {
    static async Registry(body: RegistryRequest) {
        return await this.Post<RegistryResponse>({
            url: "/users",
            body: body,
        })
    }

    static async Login(body: LoginRequest) {
        return await this.Post<LoginResponse>({
            url: "/users/login",
            body: body,
        })
    }
}