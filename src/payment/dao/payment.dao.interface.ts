import { DataServiceCondition, ResponseObject } from 'src/shared/types';
import { Payment } from './payment.entity';
import { Tourist } from 'src/booking/vo/helper.vo';

export interface IPaymentDAO {
  create(payment: Payment): Promise<ResponseObject>;
  update(payment: Payment): Promise<ResponseObject>;
  findById(id: string): Promise<ResponseObject>;
  delete(id: string): Promise<ResponseObject>;
  findAll(): Promise<ResponseObject>;
  findByCondition(condition: DataServiceCondition): Promise<ResponseObject>;
}