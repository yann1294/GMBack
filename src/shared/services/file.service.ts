import { Injectable } from '@nestjs/common';
import { Bucket, File } from '@google-cloud/storage';
import { getDownloadURL } from 'firebase-admin/storage';
import { FirebaseRepository } from '../firebase/firebase.service';
import { FileServiceResponse } from 'src/types';
import { log } from 'console';

@Injectable()
export class FileService {
  // holds firebase storage referrence
  storageRef: Bucket;

  constructor(private readonly firebaseRepository: FirebaseRepository) {
    // assign storage instance to this.storage
    this.storageRef = firebaseRepository.storage;
  }

  private errorHandler(e: unknown): FileServiceResponse {
    log();
    return {
      status: e['code'],
      message: e['message'],
      data: null,
    } as FileServiceResponse;
  }

  async uploadFile(
    fileBuffer: Buffer,
    contentType: string,
    destination: string,
  ) {
    try {
      const file: File = this.storageRef.file(destination);
      await file.save(fileBuffer, { contentType: contentType });

      return {
        status: 'success',
        message: 'File uploaded successfully',
        data: [await getDownloadURL(file)],
      } as FileServiceResponse;
    } catch (e) {
      return this.errorHandler(e);
    }
  }
}
