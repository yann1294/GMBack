import { ResponseObject } from "src/shared/types";
import { AdminVO } from "../vo/admin.vo";
import { GuideVO } from "../vo/guide.vo";

export interface IAdminService {
        // admin related
        addAdmin(adminVO: AdminVO): Promise<ResponseObject>;
        deleteAdmin(uid: string): Promise<ResponseObject>;
        updateAdmin(uid: string, data: AdminVO): Promise<ResponseObject>;

        // guide related
        approveGuide(guideVO: GuideVO): Promise<ResponseObject>;
        // deleteGuide(uid: string): Promise<ResponseObject>; 
        // updateGuide(uid: string, guideVO: GuideVO): Promise<ResponseObject>;
        // findGuide(uid: string): Promise<ResponseObject>;
        getAllGuides(): Promise<ResponseObject>; // List<Guide>
        // assignGuideToTour(tourId: string, guideId: string): Promise<ResponseObject>;
        // assignGuideToPackage(packageId: string, guideId: string): Promise<ResponseObject>;
        deactivateGuideAccount(guideVO: GuideVO): Promise<ResponseObject>;
        deactivateTouristAccount(guideVO: GuideVO): Promise<ResponseObject>;

        // tourist related
        // findTourist(uid: string): Promise<ResponseObject>;
        // deleteTourist(uid: string): Promise<ResponseObject>;
        getAllTourists(): Promise<ResponseObject>; // List<Tourist>

        // booking related
        readBooking(uid: string): Promise<ResponseObject>;
        readBookings(): Promise<ResponseObject>;
        readBill(uid: string): Promise<ResponseObject>;
        sendBill(uid: string): Promise<ResponseObject>;
        readComplaints(): Promise<ResponseObject>; // could be implemented as a chat system from the support & help container
        respondToComplaints(uid: string): Promise<ResponseObject>; // could be implemented as a chat system from the support & help container

        // from tour container
        getTours(): Promise<ResponseObject>;
        getPackages(): Promise<ResponseObject>;
        readBookings(): Promise<ResponseObject>;

}