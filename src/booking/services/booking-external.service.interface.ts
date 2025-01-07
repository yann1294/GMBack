import { ResponseObject } from 'src/shared/types';
import { BookingVO } from '../vo/booking.master.vo';

export interface IBookingExternalService {
  getBookingDetails(bookingVo: BookingVO): Promise<ResponseObject>;
  getBookingStatus(bookingVo: BookingVO): Promise<string>;
  readBookings(): Promise<ResponseObject>;
  bookPackage(packageId: string, uid: string): Promise<ResponseObject>;
}
