import { ResponseObject } from "src/shared/types";
import { IGuideDAO } from "./guide.dao.interface";
import { Guide } from "./guide.entity";
import { Inject, Injectable } from "@nestjs/common";
import { GUIDE_DAO_TOKEN } from "../utils/token";
import { DataService } from "src/shared/services/data.service";

@Injectable()
export class GuideDAO implements IGuideDAO {
    collectionName: string = 'guides'; 

    constructor(private readonly dataService: DataService) {}

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
            `${this.identificationPhotoStoragePath}/${guide.uid}`,
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

    async delete(guide: Guide): Promise<ResponseObject> {
        return await this.dataService.deleteDoc(this.collectionName, guide.uid);
    }
    async update(guide: Guide): Promise<ResponseObject> {
        // check if profile photo is available
        if (guide.profilePhoto !== undefined) {
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

            // update profile photo
            guide.profilePhoto = profilePhotoResponse.data as string;
        }

        // check if identification photo is available
        if (guide.identification !== undefined) {
            // upload identification photo
            let identityPhotoResponse = await this.fileService.uploadFile(
                (guide.identification.file as FileDTO).buffer,
                (guide.identification.file as FileDTO).mimeType,
                `${this.identificationPhotoStoragePath}/${guide.uid}`,
            );

            // check whether identity photo was uploaded successfully
            if (identityPhotoResponse.status !== "success") {
                return identityPhotoResponse;
            }

            // update identification photo
            guide.identification.file = identityPhotoResponse.data as string;
        }

        return await this.dataService.updateDoc(this.collectionName, guide.uid, guide.toUpdateObject());
    }
    async findById(guide: Guide): Promise<ResponseObject> {
        return await this.dataService.readDoc(this.collectionName, guide.uid);
    }
    async findAll(): Promise<ResponseObject> {
        return await this.dataService.readAllDocs(this.collectionName);
    }
    
}