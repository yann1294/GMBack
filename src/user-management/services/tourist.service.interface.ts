import { ResponseObject } from "src/shared/types";
import { TouristVO } from "../vo/tourist.vo";
import { BookingVO } from "src/booking/vo/booking.master.vo";

export interface ITouristService {
    addTourist(touristVo: TouristVO): Promise<ResponseObject>;
    deleteTourist(touristVo: TouristVO): Promise<ResponseObject>;
    updateTourist(touristVo: TouristVO): Promise<ResponseObject>;
    findTourist(touristVo: TouristVO): Promise<ResponseObject>;
    bookTour(bookingVo: BookingVO): Promise<ResponseObject>;
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
  