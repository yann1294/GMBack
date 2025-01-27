import { Injectable } from "@nestjs/common";
import { IPaymentDAO } from "./payment.dao.interface";
import { DataServiceCondition, ResponseObject } from "src/shared/types";
import { Payment } from "./payment.entity";
import { Tourist } from "src/booking/vo/helper.vo";
import { DataService } from "src/shared/services/data.service";

@Injectable()
export class PaymentDAO implements IPaymentDAO {
  collectionName: string = "payments";
  constructor(
    private readonly dataService: DataService,
  ){}
  async update(payment: Payment): Promise<ResponseObject> {
    return await this.dataService.updateDoc(this.collectionName, payment.id, payment.toUpdateObject());
  }
  async findById(id: string): Promise<ResponseObject> {
    return await this.dataService.readDoc(this.collectionName, id);
  }
  async delete(id: string): Promise<ResponseObject> {
    return await this.dataService.deleteDoc(this.collectionName, id);
  }
  async findAll(): Promise<ResponseObject> {
    return await this.dataService.readAllDocs(this.collectionName);
  }
  async create(payment: Payment): Promise<ResponseObject> {
    return await this.dataService.createDoc(payment, this.collectionName);
  }
  async findByCondition(condition: DataServiceCondition | DataServiceCondition[]): Promise<ResponseObject> {
    return await this.dataService.readDocsWithConditions(this.collectionName, condition);
  }
}