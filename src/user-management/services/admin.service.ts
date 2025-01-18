import { Inject, Injectable } from "@nestjs/common";
import { IAdminService } from "./admin.service.interface";
import { ADMIN_DAO_TOKEN, GUIDE_SERVICE_TOKEN, TOURIST_SERVICE_TOKEN } from "../utils/token";
import { ResponseObject } from "src/shared/types";
import { GuideVO } from "../vo/guide.vo";
import { IAdminDAO } from "../dao/admin.dao.interface";
import { AdminVO } from "../vo/admin.vo";
import { IGuideService } from "./guide.service.interface";
import { ITouristService } from "./tourist.service.interface";

@Injectable()
export class AdminService implements IAdminService {
    constructor(
        @Inject(ADMIN_DAO_TOKEN) private readonly adminDAO: IAdminDAO,
        @Inject(GUIDE_SERVICE_TOKEN) private readonly guideService: IGuideService,  // Inject GuideService
        @Inject(TOURIST_SERVICE_TOKEN) private readonly touristService: ITouristService  // Inject TouristService
    ) {}

    // Admin related methods
    addAdmin(adminVO: AdminVO): Promise<ResponseObject> {
        //takes the adminVO and passes it to the DAO 
        // convert the adminVO to an admin entity
        return this.adminDAO.create(adminVO.toEntity());
    }
    
    deleteAdmin(uid: string): Promise<ResponseObject> {
        // takes the uid and passes it to the DAO
        return this.adminDAO.delete(uid);
    }
    updateAdmin(uid: string, adminVO: AdminVO): Promise<ResponseObject> {
        // converts the adminVO to an admin entity
        // takes the uid and admin entity and passes it to the DAO
        return this.adminDAO.update(uid, adminVO.toEntity());
    }

    // Guide related methods
    // async deleteGuide(uid: string): Promise<ResponseObject> {
    //     // takes the uid and passes it to the DAO
    //     return await this.guideService.deleteGuide(uid);
    // }

    // updateGuide(uid: string, guideVO: GuideVO): Promise<ResponseObject> {
    //     // takes the uid and guide entity and passes it to the DAO
    //     return this.guideService.updateGuide(uid, guideVO);
    // }

    // findGuide(uid: string): Promise<ResponseObject> {
    //     // takes the uid and passes it to the DAO
    //     return this.guideService.findGuide(uid);
    // }
    
    getAllGuides(): Promise<ResponseObject> {
        // calls the DAO to get all guides
        return this.guideService.getAllGuides();
    }
    // TODO
    approveGuide(guideVO: GuideVO): Promise<ResponseObject> {
        // This is the last part of the guide creation process 
        throw new Error("Method not implemented.");
    }
    assignGuideToTour(tourId: string, guideId: string): Promise<ResponseObject> {
        // this is part of the tour creation process
        // however, this process requires an internal service communication between Tour and UM containers
        throw new Error("Method not implemented.");
    }
    assignGuideToPackage(packageId: string, guideId: string): Promise<ResponseObject> {
        // this is part of the package creation process
        // however, this process requires an internal service communication between Tour and UM containers
        throw new Error("Method not implemented.");
    }
    deactivateGuideAccount(guideVO: GuideVO): Promise<ResponseObject> {
        throw new Error("Method not implemented.");
    }
    deactivateTouristAccount(guideVO: GuideVO): Promise<ResponseObject> {
        throw new Error("Method not implemented.");
    }

    // // Tourist related methods
    // findTourist(uid: string): Promise<ResponseObject> {
    //     // takes the uid and passes it to the DAO
    //     return this.touristService.findTourist(uid);
    // }
    // deleteTourist(uid: string): Promise<ResponseObject> {
    //     // takes the uid and passes it to the DAO
    //     return this.touristService.deleteTourist(uid);
    // }
    getAllTourists(): Promise<ResponseObject> {
        // calls the DAO to get all tourists
        return this.touristService.getAllTourists();
    }
    
    // TODO : Booking related methods which require to consume the booking internal service
    readBooking(uid: string): Promise<ResponseObject> {
        // takes the uid and passes it to the DAO
        throw new Error("Method not implemented.");
    }
    readBookings(): Promise<ResponseObject> {
        // calls the DAO to get all bookings
        throw new Error("Method not implemented.");
    }
    readBill(uid: string): Promise<ResponseObject> { 
        // this needs Billing container
        // takes the uid and passes it to the DAO
        throw new Error("Method not implemented.");
    }
    sendBill(uid: string): Promise<ResponseObject> { 
        // this needs Billing container but a lightweight version of it can be implemented here
        // takes the uid and passes it to the DAO
        throw new Error("Method not implemented.");
    }
    readComplaints(): Promise<ResponseObject> {
        // this requires Support & Help container
        throw new Error("Method not implemented.");
    }
    respondToComplaints(uid: string): Promise<ResponseObject> {
        // this requires Support & Help container
        throw new Error("Method not implemented.");
    }

    // TODO: Tour related methods which require to consume the Tour internal service
    getTours(): Promise<ResponseObject> {
        // this requires Tour container. It consumes the data at rest i.e. tour collection
        // calls the DAO to get all tours
        throw new Error("Method not implemented.");
    }
    getPackages(): Promise<ResponseObject> {
        // this requires Tour container. It consumes the data at rest i.e. package collection
        // calls the DAO to get all packages
        throw new Error("Method not implemented.");
    }
    
}