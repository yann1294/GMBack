import { Injectable } from "@nestjs/common";
import { IPaymentDAO } from "./payment.dao.interface";
import { ResponseObject } from "src/shared/types";
import { Payment } from "./payment.entity";
import { Tourist } from "src/booking/vo/helper.vo";

@Injectable()
export class PaymentDAO implements IPaymentDAO {
  update(payment: Payment): Promise<ResponseObject> {
    throw new Error("Method not implemented.");
  }
  findById(payment: Payment): Promise<ResponseObject> {
    throw new Error("Method not implemented.");
  }
  delete(payment: Payment): Promise<ResponseObject> {
    throw new Error("Method not implemented.");
  }
  findAll(tourist: Tourist): Promise<ResponseObject> {
    throw new Error("Method not implemented.");
  }
  create(payment: Payment): Promise<ResponseObject> {
    throw new Error("Method not implemented.");
  }
}