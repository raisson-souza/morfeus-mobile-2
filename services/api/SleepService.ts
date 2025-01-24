import { CreateSleepCycleRequest, CreateSleepCycleResponse, DeleteSleepRequest, DeleteSleepResponse, GetSleepRequest, GetSleepResponse, ListSleepByUserRequest, ListSleepByUserResponse, ListSleepsForDreamCreationRequest, ListSleepsForDreamCreationResponse } from "../../types/sleeps"
import Endpoints from "./base/Endpoints"

export default abstract class SleepService extends Endpoints {
    static async Create(online: boolean, request: CreateSleepCycleRequest) {
        return await this.Post<CreateSleepCycleResponse>({
            url: "/sleeps",
            authorization: await this.GetAuthorization(),
            body: request,
        })
    }

    static async Update() {

    }

    static async GetSleep(online: boolean, request: GetSleepRequest) {
        return await this.Get<GetSleepResponse>({
            url: `/sleeps/${ request.id }`,
            authorization: await this.GetAuthorization()
        })
    }

    static async DeleteSleep(online: boolean, request: DeleteSleepRequest) {
        return await this.Delete<DeleteSleepResponse>({
            url: `/sleeps/${ request.id }`,
            authorization: await this.GetAuthorization(),
        })
    }

    static async ListByUser(online: boolean, request: ListSleepByUserRequest) {
        return await this.Get<ListSleepByUserResponse>({
            url: `/users/sleeps/list?date=${ request.date }`,
            authorization: await this.GetAuthorization()
        })
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