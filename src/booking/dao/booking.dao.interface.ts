import { DataServiceCondition, ResponseObject } from 'src/shared/types';
import { Booking } from './booking.entity';
import { Guide } from 'src/user-management/dao/guide.entity';
import { Tourist } from 'src/user-management/dao/tourist.entity';

export default interface IBookingDAO {
  findAll(): Promise<ResponseObject>;
  findByResourceId(booking: Booking): Promise<ResponseObject>;
  findAllByTourist(tourist: Tourist): Promise<ResponseObject>;
  findAllByGuide(guide: Guide): Promise<ResponseObject>;
  findById(booking: Booking): Promise<ResponseObject>;
  create(booking: Booking): Promise<ResponseObject>;
  update(booking: Booking): Promise<ResponseObject>;
  delete(booking: Booking): Promise<ResponseObject>;
  findResource(resourceType: string, resourceId: string): Promise<ResponseObject>;
  findByCondition(condition: DataServiceCondition | DataServiceCondition[]): Promise<ResponseObject>;
}
