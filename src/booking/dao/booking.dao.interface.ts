import { ResponseObject } from 'src/shared/types';
import { Booking } from './booking.entity';

export default interface IBookingServiceDAO {
  findAll(): Promise<ResponseObject>;
  findByResourceId(id: string): Promise<ResponseObject>;
  findAllByTourist(id: string): Promise<ResponseObject>;
  findAllByGuide(id: string): Promise<ResponseObject>;
  findById(id: string): Promise<ResponseObject>;
  create(data: Booking): Promise<ResponseObject>;
  update(id: string, data: Booking): Promise<ResponseObject>;
  delete(id: string, data?: Booking): Promise<ResponseObject>;
}
