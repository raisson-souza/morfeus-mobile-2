import { ListSleepsForDreamCreationRequest, ListSleepsForDreamCreationResponse } from "../../types/sleeps"
import Endpoints from "./base/Endpoints"

export default abstract class SleepService extends Endpoints {
    static async Create() {

    }

    static async Update() {

    }

    static async GetSleep() {

    }

    static async DeleteSleep() {

    }

    static async ListByUser() {

    }

    static async CreateSimpleSleep() {

    }

    static async AskSimpleSleep() {

    }

    static async GetSimpleSleep() {

    }

    static async ListSleepsForDreamCreation(request: ListSleepsForDreamCreationRequest) {
        return await this.Get<ListSleepsForDreamCreationResponse>({
            url: `/sleeps/list_sleeps_for_dream_creation?pageNumber=${ request.pageNumber }`,
            authorization: await this.GetAuthorization()
        })
    }
}