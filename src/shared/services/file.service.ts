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
      status: 'failure',
      code: e['code'],
      message: e['message'],
      data: null,
    } as FileServiceResponse;
  }

  public getPathFromURL(fileURL: string): string | null {
    // get file path from url
    const match: RegExpMatchArray = fileURL.match(/\/o\/(.*?)\?/);

    // checking whether patterns found
    if (match === null || !(match[0] && match[1])) {
      return null;
    }

    // return file path
    return match[1].replaceAll('%2F', '/');
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

  async deleteFile(fileURL: string) {
    try {
      // get path from url
      const filePath = this.getPathFromURL(fileURL);

      // checking whether patterns found
      if (!filePath) {
        return {
          status: 'invalid-url',
          message: 'Invalid Firebase Storage URL',
          data: null,
        } as FileServiceResponse;
      }

      // delete file
      const file: File = this.storageRef.file(filePath);
      await file.delete();

      return {
        status: 'success',
        message: 'Successfully deleted file.',
        data: null,
      } as FileServiceResponse;
    } catch (e) {
      return this.errorHandler(e);
    }
  }
}
