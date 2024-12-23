import { ResponseObject } from "src/shared/types";
import { IGuideDAO } from "./guide.dao.interface";
import { Guide } from "./guide.entity";
import { Inject, Injectable } from "@nestjs/common";
import { GUIDE_DAO_TOKEN } from "../vo/token";
import { DataService } from "src/shared/services/data.service";

@Injectable()
export class GuideDAO implements IGuideDAO {
    collectionName: string = 'guides';

    constructor(private readonly dataService: DataService) {}

    async create(guide: Guide): Promise<ResponseObject> {
        return await this.dataService.createDoc(guide, this.collectionName);
    }
    async delete(uid: string): Promise<ResponseObject> {
        return await this.dataService.deleteDoc(this.collectionName, uid);
    }
    async update(uid: string, guide: Guide): Promise<ResponseObject> {
        return await this.dataService.updateDoc(this.collectionName, uid, guide);
    }
    async findById(uid: string): Promise<ResponseObject> {
        return await this.dataService.readDoc(this.collectionName, uid);
    }
    async findAll(): Promise<ResponseObject> {
        return await this.dataService.readAllDocs(this.collectionName);
    }
    
}