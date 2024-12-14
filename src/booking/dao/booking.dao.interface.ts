import { ResponseObject } from "src/shared/types";

interface IBookingServiceDAO {
    displayGuide(): Promise<ResponseObject>;
    cancelBooking(): Promise<ResponseObject>;
    makeBooking(): Promise<ResponseObject>;
    modifyBooking(): Promise<ResponseObject>;
    displayBooking(): Promise<ResponseObject>;
    displayBookingHistory(): Promise<ResponseObject>;
    makePayment(): Promise<ResponseObject>;
    reserveBooking(): Promise<ResponseObject>;
}