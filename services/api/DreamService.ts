import { CreateDreamRequest, CreateDreamResponse, DeleteDreamRequest, DeleteDreamResponse, GetDreamRequest, GetDreamResponse, ListDreamByUserResponse, ListDreamsBySleepCycleRequest, ListDreamsBySleepCycleResponse, ListDreamsByUserRequest, UpdateDreamRequest, UpdateDreamResponse } from "../../types/dream"
import Endpoints from "./base/Endpoints"

export default abstract class DreamService extends Endpoints {
    static async Create(request: CreateDreamRequest) {
        return await this.Post<CreateDreamResponse>({
            url: "/dreams",
            authorization: await this.GetAuthorization(),
            body: request
        })
    }

    static async Update(request: UpdateDreamRequest) {
        return await this.Put<UpdateDreamResponse>({
            url: "/dreams",
            authorization: await this.GetAuthorization(),
            body: request,
        })
    }

    static async GetDream(request: GetDreamRequest) {
        return await this.Get<GetDreamResponse>({
            url: `/dreams/${ request.id }`,
            authorization: await this.GetAuthorization()
        })
    }

    static async DeleteDream(request: DeleteDreamRequest) {
        return await this.Delete<DeleteDreamResponse>({
            url: `/dreams/${ request.id }`,
            authorization: await this.GetAuthorization(),
        })
    }

    static async ListByUser(body: ListDreamsByUserRequest) {
        return await this.Post<ListDreamByUserResponse>({
            url: "/users/dreams/list",
            authorization: await this.GetAuthorization(),
            body: body
        })
    }

    static async ListBySleep(request: ListDreamsBySleepCycleRequest) {
        return await this.Get<ListDreamsBySleepCycleResponse>({
            url: `/dreams/listBySleep?sleep_id=${ request.sleepId }`,
            authorization: await this.GetAuthorization()
        })
    }
}