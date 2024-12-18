import { DreamModel } from "./dream"

export type TagModel = {
    title: string
    id: number
}

export type ListTagByDreamRequest = {
    dreamId: number
}

export type ListTagByDreamResponse = TagModel[]

export type ListDreamsByTagRequest = {
    tagId: number
}

export type ListDreamsByTagResponse = DreamModel[]