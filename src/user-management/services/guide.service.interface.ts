import { ResponseObject } from "src/shared/types";
import { GuideVO } from "../vo/guide.vo";

export interface IGuideService {
        addGuide(guideVo: GuideVO): Promise<ResponseObject>;
        deleteGuide(uid: string): Promise<ResponseObject>;
        updateGuide(uid: string, data: GuideVO): Promise<ResponseObject>;
        findGuide(uid: string): Promise<ResponseObject>;
        approveBooking(bookingId: string): Promise<ResponseObject>;
        declineBooking(bookingId: string): Promise<ResponseObject>;
        getAllGuides(): Promise<ResponseObject>;

        // from tour container
        getTours(): Promise<ResponseObject>;
        getPackages(): Promise<ResponseObject>;
        readBookings(): Promise<ResponseObject>;


        // TODO: Model complaints
        // readComplaints(): Promise<ResponseObject>;
        // sendComplaints(complaint: string): Promise<ResponseObject>;
}