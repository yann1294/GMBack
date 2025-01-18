import { ResponseObject } from "src/shared/types";
import { Admin } from "./admin.entity";

export interface IAdminDAO {
    create(admin: Admin): Promise<ResponseObject>;
    delete(uid: string): Promise<ResponseObject>;
    update(uid: string, admin: Admin): Promise<ResponseObject>;
    findById(uid: string): Promise<ResponseObject>;
    findAll(): Promise<ResponseObject>;
  }