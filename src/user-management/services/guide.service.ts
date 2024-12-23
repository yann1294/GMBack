import { Inject } from "@nestjs/common";
import { IGuideService } from "./guide.service.interface";
import { GUIDE_DAO_TOKEN } from "../vo/token";
import { ResponseObject } from "src/shared/types";
import { GuideVO } from "../vo/user.guide.vo";
import { IGuideDAO } from "../dao/guide.dao.interface";

export class GuideService implements IGuideService {
    constructor(@Inject(GUIDE_DAO_TOKEN) private readonly guideService: IGuideDAO) {}
    async addGuide(guideVo: GuideVO): Promise<ResponseObject> {
        return await this.guideService.create(guideVo.toEntity());
    }
    async deleteGuide(uid: string): Promise<ResponseObject> {
        return await this.guideService.delete(uid);
    }
    async updateGuide(uid: string, data: GuideVO): Promise<ResponseObject> {
        return await this.guideService.update(uid, data.toEntity());
    }
    async findGuide(uid: string): Promise<ResponseObject> {
        return await this.guideService.findById(uid);
    }

    async getAllGuides(): Promise<ResponseObject> {
        return await this.guideService.findAll();
    }


    // TODO: Implement this with booking and tour containers
    async approveBooking(bookingId: string): Promise<ResponseObject> {
        throw new Error("Method not implemented.");
    }
    async declineBooking(bookingId: string): Promise<ResponseObject> {
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