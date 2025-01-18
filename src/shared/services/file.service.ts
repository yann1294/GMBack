import { Injectable } from '@nestjs/common';
import { Bucket, File, TransferManager } from '@google-cloud/storage';
import { getDownloadURL } from 'firebase-admin/storage';
import { FirebaseRepository } from '../firebase/firebase.service';
import { FileServiceResponse } from 'src/shared/types';
import { log } from 'console';
import { MultipartFile } from '@fastify/multipart';
import { Timestamp } from 'firebase-admin/firestore';

@Injectable()
export class FileService {
  // holds firebase storage reference
  storageRef: Bucket;

  constructor(private readonly firebaseRepository: FirebaseRepository) {
    // assign storage instance to this.storage
    this.storageRef = firebaseRepository.storage;
  }

  /**
   * Logs and returns FileService errors.
   *
   * @param e - Error object.
   * @returns A promise that resolves to a FileServiceResponse containing the error message.
   */
  private errorHandler(e: unknown): FileServiceResponse {
    log(e['message']);
    return {
      status: 'failure',
      code: e['code'],
      message: e['message'],
      data: null,
    } as FileServiceResponse;
  }

  /**
   * Finds the file path from a Cloud Storage download URL.
   *
   * @param fileURL - The Cloud Storage download URL.
   * @returns The file path if found; otherwise, null for an invalid Cloud Storage URL.
   */
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

  /**
   * Uploads a file to Cloud Storage.
   *
   * @param fileBuffer - The file content buffer.
   * @param contentType - The file's MIME type.
   * @param destination - The file path from root to filename.
   * @returns A promise that resolves to a FileServiceResponse containing the download URL or an error message.
   */
  async uploadFile(
    fileBuffer: Buffer,
    contentType: string,
    destination: string,
  ): Promise<FileServiceResponse> {
    try {
      const file: File = this.storageRef.file(destination);
      await file.save(fileBuffer, { contentType: contentType });

      return {
        status: 'success',
        message: 'File uploaded successfully',
        data: await getDownloadURL(file),
      } as FileServiceResponse;
    } catch (e) {
      return this.errorHandler(e);
    }
  }

  /**
   * Uploads multiple files to Cloud Storage.
   *
   * @param files - The file content buffer.
   * @param destination - Folder path where files should be uploaded.
   * @returns A promise that resolves to a FileServiceResponse containing download URLs or an error message.
   */
  async uploadFiles(
    files: AsyncIterableIterator<MultipartFile>,
    destination: string,
  ): Promise<FileServiceResponse> {
    try {
      // hold ref to uploaded files
      const downloadUrls: string[] = [];

      for await (const file of files) {
        // concat file destination with file name
        // const filePath =
        //   destination +
        //   `/${Timestamp.now().toMillis()}.${file.filename.split('.').slice(-1)[0]}`;
        console.log(file)
        const filePath = `${destination}/${Timestamp.now().toMillis()}`;

        // create file
        const fileRef: File = this.storageRef.file(filePath);

        // add save promise to save promises
        await fileRef.save(await file.toBuffer(), {
          contentType: file.mimetype,
        });

        // get download url
        downloadUrls.push(await getDownloadURL(fileRef));
      }

      return {
        status: 'success',
        code: 200,
        message: 'Files successfully uploaded',
        data: downloadUrls,
      } as FileServiceResponse;
    } catch (e) {
      return this.errorHandler(e);
    }
  }
  
  /**
   * Deletes a file from Cloud Storage.
   *
   * @param fileURL - Cloud Storage download URL of a file.
   * @returns A promise that resolves to a FileServiceResponse containing a success message or an error message.
   */
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
