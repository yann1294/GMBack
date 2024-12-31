import { ResponseObject } from 'src/shared/types';

export interface IBookingExternalService {
  getBookingDetails(bookingId: string): Promise<ResponseObject>;
  getBookingStatus(bookingId: string): Promise<string>;
  readBookings(): Promise<ResponseObject>;
  bookPackage(packageId: string, uid: string): Promise<ResponseObject>;
}
