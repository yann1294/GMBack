import { ResponseObject } from 'src/shared/types';

export interface IBookingExternalService {
  getBookingDetails(bookingId: string): Promise<ResponseObject>;
  getBookingStatus(bookingId: string): Promise<string>;
}
