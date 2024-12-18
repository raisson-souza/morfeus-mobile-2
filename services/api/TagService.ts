import { ListDreamsByTagRequest, ListDreamsByTagResponse, ListTagByDreamRequest, ListTagByDreamResponse } from "../../types/tag"
import Endpoints from "./base/Endpoints"

export default abstract class TagService extends Endpoints {
    static async ListByDream(online: boolean, request: ListTagByDreamRequest) {
        return await this.Get<ListTagByDreamResponse>({
            url: `/tags/list_by_dream?dreamId=${ request.dreamId }`,
            authorization: await this.GetAuthorization()
        })
    }

    static async ListDreamsByTag(online: boolean, request: ListDreamsByTagRequest) {
        return await this.Get<ListDreamsByTagResponse>({
            url: `/tags/list_dreams_by_tag?tagId=${ request.tagId }`,
            authorization: await this.GetAuthorization()
        })
    }
}