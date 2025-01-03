import { ResponseObject } from "src/shared/types";
import { IAdminDAO } from "./admin.dao.interface";
import { Inject, Injectable } from "@nestjs/common";
import { GUIDE_DAO_TOKEN } from "../utils/token";
import { DataService } from "src/shared/services/data.service";
import { Admin } from "./admin.entity";

@Injectable()
export class AdminDAO implements IAdminDAO {
    collectionName: string = 'admins';

    constructor(private readonly dataService: DataService) {}

    async create(admin: Admin): Promise<ResponseObject> {
        return await this.dataService.createDoc(admin, this.collectionName);
    }
    async delete(uid: string): Promise<ResponseObject> {
        return await this.dataService.deleteDoc(this.collectionName, uid);
    }
    async update(uid: string, admin: Admin): Promise<ResponseObject> {
        return await this.dataService.updateDoc(this.collectionName, uid, admin.toUpdateObject());
    }
    async findById(uid: string): Promise<ResponseObject> {
        return await this.dataService.readDoc(this.collectionName, uid);
    }
    async findAll(): Promise<ResponseObject> {
        return await this.dataService.readAllDocs(this.collectionName);
    }
    
}