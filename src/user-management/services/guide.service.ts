import { Inject, Injectable } from "@nestjs/common";
import { IGuideService } from "./guide.service.interface";
import { GUIDE_DAO_TOKEN } from "../vo/token";
import { ResponseObject } from "src/shared/types";
import { GuideVO } from "../vo/user.guide.vo";
import { IGuideDAO } from "../dao/guide.dao.interface";
import { userRoles } from "../utils/roles.util";

@Injectable()
export class GuideService implements IGuideService {
    constructor(@Inject(GUIDE_DAO_TOKEN) private readonly guideDAO: IGuideDAO) {}
    async addGuide(guideVo: GuideVO): Promise<ResponseObject> {
        // assign guide role
        guideVo.role = userRoles.guide;
        return await this.guideDAO.create(guideVo.toEntity());
    }
    async deleteGuide(uid: string): Promise<ResponseObject> {
        return await this.guideDAO.delete(uid);
    }
    async updateGuide(uid: string, data: GuideVO): Promise<ResponseObject> {
        return await this.guideDAO.update(uid, data.toEntity());
    }
    async findGuide(uid: string): Promise<ResponseObject> {
        return await this.guideDAO.findById(uid);
    }

    async getAllGuides(): Promise<ResponseObject> {
        return await this.guideDAO.findAll();
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