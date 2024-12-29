import { FileServiceResponse, ResponseObject } from "src/shared/types";
import { IGuideDAO } from "./guide.dao.interface";
import { Injectable } from "@nestjs/common";
import { DataService } from "src/shared/services/data.service";
import { FileDTO } from "../controller/dto/helper.dto";
import { Timestamp } from "firebase-admin/firestore";
import { FileService } from "src/shared/services/file.service";
import { Guide } from "./guide.entity";

@Injectable()
export class GuideDAO implements IGuideDAO {
    collectionName: string = 'guides';
    profilePhotoStoragePath: string = 'profile_photos';
    identificationPhotoStoragePath: string = 'identification_photos';

    constructor(
        private readonly dataService: DataService,
        private readonly fileService: FileService,
    ) { }

    async create(guide: Guide): Promise<ResponseObject> {
        // generate uid
        guide.uid = this.dataService.getDocId(this.collectionName);

        // upload profile photo
        let profilePhotoResponse: FileServiceResponse = await this.fileService.uploadFile(
            (guide.profilePhoto as FileDTO).buffer,
            (guide.profilePhoto as FileDTO).mimeType,
            `${this.profilePhotoStoragePath}/${guide.uid}`,
        );

        // check whether profile photo was uploaded successfully
        if (profilePhotoResponse.status !== "success") {
            return profilePhotoResponse;
        }

        // upload identity photo
        let identityPhotoResponse = await this.fileService.uploadFile(
            (guide.identification.file as FileDTO).buffer,
            (guide.identification.file as FileDTO).mimeType,
            `${this.identificationPhotoStoragePath}/${Timestamp.now().toMillis()}`,
        );

        // check whether identity photo was uploaded successfully
        if (identityPhotoResponse.status !== "success") {
            return identityPhotoResponse;
        }

        // update fields
        guide.profilePhoto = profilePhotoResponse.data as string;
        guide.identification.file = identityPhotoResponse.data as string;

        return await this.dataService.createDoc(guide, this.collectionName, true);
    }

    async delete(uid: string): Promise<ResponseObject> {
        return await this.dataService.deleteDoc(this.collectionName, uid);
    }
    async update(uid: string, guide: Guide): Promise<ResponseObject> {
        // check if profile photo is available
        if (guide.profilePhoto !== undefined) {
            // upload profile photo
            let profilePhotoResponse: FileServiceResponse = await this.fileService.uploadFile(
                (guide.profilePhoto as FileDTO).buffer,
                (guide.profilePhoto as FileDTO).mimeType,
                `${this.profilePhotoStoragePath}/${Timestamp.now().toMillis()}`,
            );

            // check whether profile photo was uploaded successfully
            if (profilePhotoResponse.status !== "success") {
                return profilePhotoResponse;
            }

            // update profile photo
            guide.profilePhoto = profilePhotoResponse.data as string;
        }

        // check if identification photo is available
        if (guide.identification !== undefined) {
            // upload identification photo
            let identityPhotoResponse = await this.fileService.uploadFile(
                (guide.identification.file as FileDTO).buffer,
                (guide.identification.file as FileDTO).mimeType,
                `${this.identificationPhotoStoragePath}/${Timestamp.now().toMillis()}`,
            );

            // check whether identity photo was uploaded successfully
            if (identityPhotoResponse.status !== "success") {
                return identityPhotoResponse;
            }

            // update identification photo
            guide.identification.file = identityPhotoResponse.data as string;
        }

        return await this.dataService.updateDoc(this.collectionName, uid, guide.toUpdateObject());
    }
    async findById(uid: string): Promise<ResponseObject> {
        return await this.dataService.readDoc(this.collectionName, uid);
    }
    async findAll(): Promise<ResponseObject> {
        return await this.dataService.readAllDocs(this.collectionName);
    }
}