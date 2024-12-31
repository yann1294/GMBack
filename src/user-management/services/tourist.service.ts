import { BookingVO } from "src/booking/vo/booking.master.vo";
import { ResponseObject } from "src/shared/types";
import { TouristVO } from "../vo/user.tourist.vo";
import { ITouristService } from "./tourist.service.interface";
import { Inject, Injectable } from "@nestjs/common";
import { TOURIST_DAO_TOKEN } from "../vo/token";
import { ITouristDAO } from "../dao/tourist.dao.interface";
import { userRoles } from "../utils/roles.util";

@Injectable()
export class TouristService implements ITouristService {

    constructor(@Inject(TOURIST_DAO_TOKEN) private readonly touristDAO: ITouristDAO) {}

    async addTourist(touristVo: TouristVO): Promise<ResponseObject> {
        // assign tourist role
        touristVo.role = userRoles.guide;
        return await this.touristDAO.create(touristVo.toEntity());
    }
    async deleteTourist(tourist: TouristVO): Promise<ResponseObject> {
        return await this.touristDAO.delete(tourist.toEntity());
    }
    async updateTourist(tourist: TouristVO): Promise<ResponseObject> {
        return await this.touristDAO.update(tourist.toEntity());
    }
    async findTourist(tourist: TouristVO): Promise<ResponseObject> {
        return await this.touristDAO.findById(tourist.toEntity());
    }

    async getAllTourists(): Promise<ResponseObject> {
        return await this.touristDAO.findAll();
    }

    // TODO: Implement using booking container
    async bookTour(booking: BookingVO): Promise<ResponseObject> {
        throw new Error("Method not implemented.");
    }
    
}