// import { Injectable } from '@nestjs/common';
// import { Bucket, File } from '@google-cloud/storage';
// import { FirebaseRepository } from '../firebase/firebase.service';
// import { FileServiceResponse } from 'src/types';
// import { log } from 'console';

// @Injectable()
// export class FileService {
//   // holds firebase storage referrence
//   storageRef: Bucket;

//   constructor(private readonly firebaseRepository: FirebaseRepository) {
//     // assign storage instance to this.storage
//     this.storageRef = firebaseRepository.storage;
//   }

//   private errorHandler(e: unknown): FileServiceResponse {
//     log(e);
//     return {} as FileServiceResponse;
//   }

//   async uploadFile(
//     fileBuffer: Buffer,
//     contentType: string,
//     destination: string,
//   ) {
//     try {
//       const file: File = this.storageRef.file(destination);
//       await file.save(fileBuffer, { contentType: contentType });

//       return {
//         status: 'success',
//         message: 'File uploaded successfully',
//         data: [file.publicUrl()],
//       } as FileServiceResponse;
//     } catch (e) {
//       return this.errorHandler(e);
//     }
//   }
// }
