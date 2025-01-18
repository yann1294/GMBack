import { ResponseObject } from "src/shared/types";
import { TouristVO } from "../vo/tourist.vo";
import { BookingVO } from "src/booking/vo/booking.master.vo";

export interface ITouristService {
    addTourist(touristVo: TouristVO): Promise<ResponseObject>;
    deleteTourist(uid: string): Promise<ResponseObject>;
    updateTourist(uid: string, data: TouristVO): Promise<ResponseObject>;
    findTourist(uid: string): Promise<ResponseObject>;
    bookTour(booking: BookingVO): Promise<ResponseObject>;
    getAllTourists(): Promise<ResponseObject>;

    // From tour container
    // getTours(): Promise<ResponseObject>;
    // getPackages(): Promise<ResponseObject>;
    // bookPackage(packageId: string, uid: string): Promise<ResponseObject>;
    // readBookings(): Promise<ResponseObject>;

    // TODO: Model complaints
    // readComplaints(): Promise<ResponseObject>;
    // sendComplaints(complaint: Complaint): Promise<ResponseObject>;
  }
  