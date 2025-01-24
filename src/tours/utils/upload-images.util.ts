import { MultipartFile } from "@fastify/multipart";
import { plainToInstance } from "class-transformer";
import { FileServiceResponse, ResponseObject } from "src/shared/types";
import { Package } from "../dao/package.entity";
import { Tour } from "../dao/tour.entity";
import { FieldValue } from "firebase-admin/firestore";
import { FileService } from "src/shared/services/file.service";
import { DataService } from "src/shared/services/data.service";
import { Injectable } from "@nestjs/common";
import { FileDTO } from "src/user-management/controller/dto/helper.dto";



@Injectable()
export class ImageManager {
    constructor(
        private readonly fileService: FileService,
        private readonly dataService: DataService,
    ) { }

    async uploadImages(
        resourceId: string,
        images: FileDTO[],
        resource: 'packages' | 'tours'
      ): Promise<ResponseObject> {
        console.log("Inside uploadImages");
        // Determine the destination path for uploaded files
        const destination = `${resource}/${resourceId}`;
        const imageUrl: string[] = [];
      
        try {
          // Upload files asynchronously and collect their URLs
          for (const image of images) {
            const uploadedUrl = await this.fileService.uploadFile(image.buffer, image.mimeType, destination);
            imageUrl.push(uploadedUrl.data as string);
          }
      
          // Update the corresponding document with the uploaded image URLs
          const updateData = plainToInstance(
            resource === 'packages' ? Package : Tour,
            { images: FieldValue.arrayUnion(...imageUrl) }
          ).toUpdateObject();
      
          const responseObj: ResponseObject = await this.dataService.updateDoc(resource, resourceId, updateData);
      
          if (responseObj.status !== 'success') {
            // Return early if the document update fails
            return responseObj;
          }
      
          // Return success response
          return {
            status: 'ok',
            code: 200,
            data: imageUrl,
            message: "Files uploaded successfully"
          };
      
        } catch (error) {
          // Handle errors gracefully
          return {
            status: 'failure',
            code: 500,
            data: null,
            message: `Error uploading files: ${error.message}`
          };
        }
      }
      

    // async deleteImage(resourceId: string, image: string, resource: 'packages' | 'tours'): Promise<ResponseObject> {

    //     // delete image from storage
    //     let response: FileServiceResponse = await this.fileService.deleteFile(image);

    //     if (response.status !== 'success') {
    //         return response;
    //     }

    //     return await this.dataService.updateDoc(
    //         resource,
    //         resourceId,
    //         plainToInstance(resource === 'packages' ? Package : Tour, {
    //             images: FieldValue.arrayUnion(...response.data)
    //         }).toUpdateObject()
    //     );
    // }
}