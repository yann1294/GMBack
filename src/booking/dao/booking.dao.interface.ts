import { ResponseObject } from 'src/shared/types';
import { Booking } from './booking.entity';

export default interface IBookingServiceDAO {
  findAllByTourist(id: string): Promise<ResponseObject>;
  findAllByGuide(id: string): Promise<ResponseObject>;
  findById(id: string): Promise<ResponseObject>;
  create(data: Booking): Promise<ResponseObject>;
  update(id: string, data: Booking): Promise<ResponseObject>;
  delete(id: string, data?: Booking): Promise<ResponseObject>;
}
