import { ResponseObject } from "src/shared/types";
import { Guide } from "./guide.entity";

export interface IGuideDAO {
    create(guide: Guide): Promise<ResponseObject>;
    delete(uid: string): Promise<ResponseObject>;
    update(uid: string, guide: Guide): Promise<ResponseObject>;
    findById(uid: string): Promise<ResponseObject>;
    findAll(): Promise<ResponseObject>;
  }