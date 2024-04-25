import {Visit} from "../allTypes/visitTypes";
import {visitsModel} from "../db/mongoDb";
import {FindCursor, InsertOneResult} from "mongodb";


class VisitsRepository {

    async createVisit(newVisit: Visit) {
        return await visitsModel.create(newVisit)
    }


    async findVisitsByIPAndURL(IP: string, URL: string) {
        return await visitsModel.find({IP, URL})
    }

}

export const visitsRepository = new VisitsRepository()


