import { MultipartFile } from '@fastify/multipart';
import { plainToInstance } from 'class-transformer';
import { FileServiceResponse, ResponseObject } from 'src/shared/types';
import { Package } from '../dao/package.entity';
import { Tour } from '../dao/tour.entity';
import { FieldValue } from 'firebase-admin/firestore';
import { FileService } from 'src/shared/services/file.service';
import { DataService } from 'src/shared/services/data.service';

let fileService: FileService;
let dataService: DataService;

export async function uploadImages(
  resourceId: string,
  images: AsyncIterableIterator<MultipartFile>,
  resource: 'packages' | 'tours',
): Promise<ResponseObject> {
  let destination = `${resource}/${resourceId}`;
  let response: FileServiceResponse = await fileService.uploadFiles(
    images,
    destination,
  );

  if (response.status !== 'success') {
    return response;
  }

  // return await dataService.updateDoc(
  //   resource,
  //   resourceId,
  //   plainToInstance(resource === 'packages' ? Package : Tour, {
  //     images: FieldValue.arrayUnion(...response.data),
  //   }).toUpdateObject(),
  // );
  //
  return null;
}

export async function deleteImage(
  resourceId: string,
  image: string,
  resource: 'packages' | 'tours',
): Promise<ResponseObject> {
  // delete image from storage
  let response: FileServiceResponse = await fileService.deleteFile(image);

  if (response.status !== 'success') {
    return response;
  }

  // return await dataService.updateDoc(
  //     resource,
  //     resourceId,
  //     plainToInstance(resource === 'packages' ? Package : Tour, {
  //         images: FieldValue.arrayUnion(...response.data)
  //     }).toUpdateObject()
  // );

  return null;
}
