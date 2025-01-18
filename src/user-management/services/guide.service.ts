import { Inject, Injectable } from "@nestjs/common";
import { IGuideService } from "./guide.service.interface";
import { GUIDE_DAO_TOKEN } from "../utils/token";
import { ResponseObject } from "src/shared/types";
import { GuideVO } from "../vo/guide.vo";
import { IGuideDAO } from "../dao/guide.dao.interface";
import { userRoles } from "../utils/roles.util";
import { BookingVO } from "src/booking/vo/booking.master.vo";

@Injectable()
export class GuideService implements IGuideService {
    constructor(@Inject(GUIDE_DAO_TOKEN) private readonly guideDAO: IGuideDAO) {}
    async addGuide(guideVo: GuideVO): Promise<ResponseObject> {
        // assign guide role
        return await this.guideDAO.create(guideVo.toEntity());
    }
    async deleteGuide(guideVo: GuideVO): Promise<ResponseObject> {
        return await this.guideDAO.delete(guideVo.toEntity());
    }
    async updateGuide(guideVo: GuideVO): Promise<ResponseObject> {
        return await this.guideDAO.update(guideVo.toEntity());
    }
    async findGuide(guideVo: GuideVO): Promise<ResponseObject> {
        return await this.guideDAO.findById(guideVo.toEntity());
    }

    async getAllGuides(): Promise<ResponseObject> {
        return await this.guideDAO.findAll();
    }


    // TODO: Implement this with booking and tour containers
    async approveBooking(bookingVo: BookingVO): Promise<ResponseObject> {
        throw new Error("Method not implemented.");
    }
    async declineBooking(bookingVo: BookingVO): Promise<ResponseObject> {
        throw new Error("Method not implemented.");
    }
    async getTours(): Promise<ResponseObject> {
        throw new Error("Method not implemented.");
    }
    async getPackages(): Promise<ResponseObject> {
        throw new Error("Method not implemented.");
    }
    async readBookings(): Promise<ResponseObject> {
        throw new Error("Method not implemented.");
    }

    
}