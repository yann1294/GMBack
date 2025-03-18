import { MultipartFile } from "@fastify/multipart";
import { plainToInstance } from "class-transformer";
import { FileServiceResponse, ResponseObject } from "src/shared/types";
import { Package } from "../dao/package.entity";
import { Tour } from "../dao/tour.entity";
import { FieldValue } from "firebase-admin/firestore";
import { FileService } from "src/shared/services/file.service";
import { DataService } from "src/shared/services/data.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { FileDTO } from "src/user-management/controller/dto/helper.dto";
import { FastifyRequest } from "fastify";



@Injectable()
export class ImageManager {
  constructor(
    private readonly fileService: FileService,
    private readonly dataService: DataService,
  ) { }

  async uploadImages(
    req: FastifyRequest,
    resource: 'packages' | 'tours'
  ): Promise<ResponseObject> {
    console.log(`API Entry: POST /${resource}/images`, { body: req.body });

    // Checking whether request is multipart
    if (!req.isMultipart()) {
      throw new BadRequestException('Request must be multipart');
    }

    let id: string = null;
    const uploadedFiles: FileDTO[] = [];

    let hasFiles = false;

    // checking whether file exceeds the limit
    try {

      // Iterate over multipart parts
      for await (const part of req.parts({ limits: { fileSize: 2 * 1024 * 1024 } })) {
        if (part.type === 'file') {
          console.log("File", part.type, part.filename);

          hasFiles = true;
          let fileBuffer: Buffer = await part.toBuffer();

          uploadedFiles.push(new FileDTO(
            part.fieldname,
            part.encoding,
            part.mimetype,
            part.filename,
            fileBuffer.byteLength,
            fileBuffer,
          ));
        } else if (part.type === 'field' && part.fieldname === 'id') {
          id = part.value as string;
        }
      }
    } catch (error) {
      if (error.message === "request file too large") {
        return {
          status: "failure",
          data: null,
          message: `Each file must have a file size of 1MB or less`,
          code: 400,
        };
      }

      console.log("Error", error);
    }

    console.log("ID", id);
    console.log("Uploaded Files", uploadedFiles);

    if (!hasFiles) {
      return {
        status: "failure",
        data: null,
        message: "No files found in form body",
        code: 400,
      };
    }

    if (!id) {
      return {
        status: "failure",
        data: null,
        message: "Id must be included in form body",
        code: 400,
      };
    }

    console.log("Inside uploadImages");
    // Determine the destination path for uploaded files
    const destination = `${resource}/${id}`;
    const imageUrl: string[] = [];

    try {
      // Upload files asynchronously and collect their URLs
      for (const image of uploadedFiles) {
        const uploadedUrl = await this.fileService.uploadFile(image.buffer, image.mimeType, destination);
        imageUrl.push(uploadedUrl.data as string);
      }

      // Update the corresponding document with the uploaded image URLs
      // const updateData = plainToInstance(
      //   resource === 'packages' ? Package : Tour,
      //   { images: FieldValue.arrayUnion(...imageUrl) }
      // )
      let updateData: Package | Tour;

if (resource === 'packages') {
  updateData = plainToInstance(
    Package,
    { images: FieldValue.arrayUnion(...imageUrl) }
  );
} else {
  updateData = plainToInstance(
    Tour,
    { images: FieldValue.arrayUnion(...imageUrl) }
  );
}

      const responseObj: ResponseObject = await this.dataService.updateDoc(resource, id, updateData);
      // const responseObj: ResponseObject = await this.dataService.updateDoc(resource, id, updateData.toUpdateObject());

      if (responseObj.status !== 'success') {
        // Return early if the document update fails
        return responseObj;
      }

      // Return success response
      return {
        status: 'success',
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