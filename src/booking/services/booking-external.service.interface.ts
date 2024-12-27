import { ResponseObject } from 'src/shared/types';

export interface BookingExternalServiceInterface {
  getBookingDetails(bookingId: string): Promise<ResponseObject>;
  getBookingStatus(bookingId: string): Promise<string>;
}
