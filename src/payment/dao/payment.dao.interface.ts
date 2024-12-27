import { ResponseObject } from 'src/shared/types';
import { Payment } from './payment.entity';

export interface IPaymentDAO {
  create(payment: Payment): Promise<ResponseObject>;
  update(id: string, payment: Payment): Promise<ResponseObject>;
  findById(id: string): Promise<ResponseObject>;
  delete(id: string): Promise<ResponseObject>;
  findAll(userId: string): Promise<ResponseObject>;
}