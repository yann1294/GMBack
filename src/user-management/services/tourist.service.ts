import { BookingVO } from "src/booking/vo/booking.master.vo";
import { ResponseObject } from "src/shared/types";
import { TouristVO } from "../vo/tourist.vo";
import { ITouristService } from "./tourist.service.interface";
import { Inject, Injectable } from "@nestjs/common";
import { TOURIST_DAO_TOKEN } from "../utils/token";
import { ITouristDAO } from "../dao/tourist.dao.interface";

@Injectable()
export class TouristService implements ITouristService {

    constructor(@Inject(TOURIST_DAO_TOKEN) private readonly touristService: ITouristDAO) {}

    async addTourist(touristVo: TouristVO): Promise<ResponseObject> {
        return await this.touristService.create(touristVo.toEntity());
    }
    async deleteTourist(uid: string): Promise<ResponseObject> {
        return await this.touristService.delete(uid);
    }
    async updateTourist(uid: string, data: TouristVO): Promise<ResponseObject> {
        return await this.touristService.update(uid, data.toEntity());
    }
    async findTourist(uid: string): Promise<ResponseObject> {
        return await this.touristService.findById(uid);
    }

    async getAllTourists(): Promise<ResponseObject> {
        return await this.touristService.findAll();
    }

    // TODO: Implement using booking container
    async bookTour(booking: BookingVO): Promise<ResponseObject> {
        throw new Error("Method not implemented.");
    }
    
}