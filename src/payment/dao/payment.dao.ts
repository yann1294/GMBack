import { Injectable } from "@nestjs/common";
import { IPaymentDAO } from "./payment.dao.interface";
import { ResponseObject } from "src/shared/types";
import { Payment } from "./payment.entity";

@Injectable()
export class PaymentDAO implements IPaymentDAO {
  create(payment: Payment): Promise<ResponseObject> {
    throw new Error("Method not implemented.");
  }
  update(id: string, payment: Payment): Promise<ResponseObject> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<ResponseObject> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<ResponseObject> {
    throw new Error("Method not implemented.");
  }
  findAll(userId: string): Promise<ResponseObject> {
    throw new Error("Method not implemented.");
  }
}