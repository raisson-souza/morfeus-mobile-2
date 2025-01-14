import Endpoints from "./base/Endpoints"

export default abstract class AnalysisService extends Endpoints {
    static async CreateDreamAnalysis(request: CreateDreamAnalysisRequest) {
        return await this.Post<CreateDreamAnalysisResponse>({
            url: `/analysis/dreams?date=${ request.date }`,
            authorization: await this.GetAuthorization(),
        })
    }

    static async GetDreamAnalysis(request: GetDreamAnalysisRequest) {
        return await this.Get<GetDreamAnalysisResponse>({
            url: `/analysis/dreams/get?date=${ request.date }`,
            authorization: await this.GetAuthorization(),
        })
    }

    static async CreateSleepAnalysis() {

    }

    static async GetSleepAnalysis() {

    }
}