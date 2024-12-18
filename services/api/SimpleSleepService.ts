import { CreateSimpleSleepRequest, CreateSimpleSleepResponse, GetSimpleSleepResponse } from "../../types/simpleSleep";
import Endpoints from "./base/Endpoints"

export default abstract class SimpleSleepService extends Endpoints {
    static async GetSimpleSleep() {
        return await this.Get<GetSimpleSleepResponse>({
            url: "/sleeps/simple_sleep",
            authorization: await this.GetAuthorization(),
        })
    }

    static async CreateSimpleSleep(request: CreateSimpleSleepRequest) {
        return await this.Post<CreateSimpleSleepResponse>({
            url: "/sleeps/simple_sleep",
            authorization: await this.GetAuthorization(),
            body: request
        })
    }
}