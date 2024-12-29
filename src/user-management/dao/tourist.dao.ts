import { DataService } from "src/shared/services/data.service";
import { ITouristDAO } from "./tourist.dao.interface";
import { Tourist } from "./tourist.entity";
import { FileServiceResponse, ResponseObject } from "src/shared/types";
import { log } from "console";
import { Injectable } from "@nestjs/common";
import { FileService } from "src/shared/services/file.service";
import { FileDTO } from "../controller/dto/helper.dto";
import { Timestamp } from "firebase-admin/firestore";

@Injectable()
export class TouristDAO implements ITouristDAO {
    collectionName: string = 'tourists';
    profilePhotoStoragePath: string = 'profile_photos';
    identificationPhotoStoragePath: string = 'identification_photos';

    constructor(
        private readonly dataService: DataService,
        private readonly fileService: FileService,
    ) { }

    async create(tourist: Tourist): Promise<ResponseObject> {
        let profilePhotoResponse: FileServiceResponse = await this.fileService.uploadFile(
            (tourist.profilePhoto as FileDTO).buffer,
            (tourist.profilePhoto as FileDTO).mimeType,
            `${this.profilePhotoStoragePath}/${Timestamp.now().toMillis()}`,
        );        

        if (profilePhotoResponse.status !== "success") {
            return profilePhotoResponse;
        }

        let identityPhotoResponse = await this.fileService.uploadFile(
            (tourist.identification.file as FileDTO).buffer,
            (tourist.identification.file as FileDTO).mimeType,
            `${this.identificationPhotoStoragePath}/${Timestamp.now().toMillis()}`,
        );

        if (identityPhotoResponse.status !== "success") {
            return identityPhotoResponse;
        }

        // update fields
        tourist.profilePhoto = profilePhotoResponse.data as string;
        tourist.identification.file = identityPhotoResponse.data as string;

        return await this.dataService.createDoc(tourist, this.collectionName);
    }
    async delete(uid: string): Promise<ResponseObject> {
        return await this.dataService.deleteDoc(this.collectionName, uid);
    }
    async update(uid: string, tourist: Tourist): Promise<ResponseObject> {
        return await this.dataService.updateDoc(this.collectionName, uid, tourist.toUpdateObject());
    }
    async findById(uid: string): Promise<ResponseObject> {
        return await this.dataService.readDoc(this.collectionName, uid);
    }
    async findAll(): Promise<ResponseObject> {
        return await this.dataService.readAllDocs(this.collectionName);
    }
}