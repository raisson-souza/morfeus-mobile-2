import { CreateDreamRequest, CreateDreamResponse, DeleteDreamRequest, DeleteDreamResponse, GetDreamRequest, GetDreamResponse, ListDreamByUserResponse, ListDreamsByUserRequest, UpdateDreamRequest, UpdateDreamResponse } from "../../types/dream"
import Endpoints from "./base/Endpoints"

export default abstract class DreamService extends Endpoints {
    static async Create(online: boolean, request: CreateDreamRequest) {
        return await this.Post<CreateDreamResponse>({
            url: "/dreams",
            authorization: await this.GetAuthorization(),
            body: request
        })
    }

    // static async CreateUncomplete(online: boolean, request: CreateDreamUncompleteRequest) {
    //     return await this.Post<CreateDreamUncompleteResponse>({
    //         url: "/dreams/uncomplete",
    //         authorization: await this.GetAuthorization(),
    //         body: request
    //     })
    // }

    static async Update(online: boolean, request: UpdateDreamRequest) {
        return await this.Put<UpdateDreamResponse>({
            url: "/dreams",
            authorization: await this.GetAuthorization(),
            body: request,
        })
    }

    static async GetDream(online: boolean, request: GetDreamRequest) {
        return await this.Get<GetDreamResponse>({
            url: `/dreams/${ request.id }`,
            authorization: await this.GetAuthorization()
        })
    }

    static async DeleteDream(online: boolean, request: DeleteDreamRequest) {
        return await this.Delete<DeleteDreamResponse>({
            url: `/dreams/${ request.id }`,
            authorization: await this.GetAuthorization(),
        })
    }

    static async ListByUser(online: boolean, body: ListDreamsByUserRequest) {
        return await this.Post<ListDreamByUserResponse>({
            url: "/users/dreams/list",
            authorization: await this.GetAuthorization(),
            body: body
        })
    }

    static async ListBySleep() {
        
    }
}