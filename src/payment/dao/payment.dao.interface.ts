import { ResponseObject } from 'src/shared/types';
import { Payment } from './payment.entity';
import { Tourist } from 'src/booking/vo/helper.vo';

export interface IPaymentDAO {
  create(payment: Payment): Promise<ResponseObject>;
  update(payment: Payment): Promise<ResponseObject>;
  findById(payment: Payment): Promise<ResponseObject>;
  delete(payment: Payment): Promise<ResponseObject>;
  findAll(tourist: Tourist): Promise<ResponseObject>;
}