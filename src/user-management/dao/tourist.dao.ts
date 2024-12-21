import { DataService } from "src/shared/services/data.service";
import { ITouristDAO } from "./tourist.dao.interface";
import { Tourist } from "./tourist.entity";
import { ResponseObject } from "src/shared/types";

export class TouristDAO implements ITouristDAO {
    collectionName: string = 'tourists';

    constructor(private readonly dataService: DataService) { }

    async create(tourist: Tourist): Promise<ResponseObject> {
        return await this.dataService.createDoc(tourist, this.collectionName);
    }
    async delete(uid: string): Promise<ResponseObject> {
        return await this.dataService.deleteDoc(this.collectionName, uid);
    }
    async update(uid: string, tourist: Tourist): Promise<ResponseObject> {
        return await this.dataService.updateDoc(this.collectionName, uid, tourist);
    }
    async findById(uid: string): Promise<ResponseObject> {
        return await this.dataService.readDoc(this.collectionName, uid);
    }
    async findAll(): Promise<ResponseObject> {
        return await this.dataService.readAllDocs(this.collectionName);
    }
}