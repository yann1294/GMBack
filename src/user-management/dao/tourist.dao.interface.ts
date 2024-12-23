import { ResponseObject } from "src/shared/types";
import { Tourist } from "./tourist.entity";

export interface ITouristDAO {
    create(tourist: Tourist): Promise<ResponseObject>;
    delete(uid: string): Promise<ResponseObject>;
    update(uid: string, tourist: Tourist): Promise<ResponseObject>;
    findById(uid: string): Promise<ResponseObject>;
    findAll(): Promise<ResponseObject>;
  }