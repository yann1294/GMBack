import { ResponseObject } from "src/shared/types";
import { Tourist } from "./tourist.entity";

export interface ITouristDAO {
    create(tourist: Tourist): Promise<ResponseObject>;
    delete(tourist: Tourist): Promise<ResponseObject>;
    update(tourist: Tourist): Promise<ResponseObject>;
    findById(tourist: Tourist): Promise<ResponseObject>;
    findAll(): Promise<ResponseObject>;
  }