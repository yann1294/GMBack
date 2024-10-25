import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from '../firebase/firebase.service';
import {
  DocumentData,
  DocumentReference,
  Firestore,
} from 'firebase-admin/firestore';
import { log } from 'console';
import { DataServiceResponse } from 'src/types';

@Injectable()
export class DataService {
  // holds firestore object from repository
  firestore: Firestore;

  constructor(firebaseRepository: FirebaseRepository) {
    // assigning firestore reference from firebase repository
    this.firestore = firebaseRepository.guideMeDb;
  }

  /**
    Creates a document on firestore.
    @param data The data to be stored in the document.
    @param path Firestore path where the data should be stored.
    @returns A [DataServiceResponse] containing the status and status code. If successful, status code is 200 other wise its different.
  */
  async createRecord(data: object, path: string): Promise<DataServiceResponse> {
    try {
      // adding data to collection
      await this.firestore.collection(path).add(data);

      // return success status
      return { status: 'ok', statusCode: 200 } as DataServiceResponse;
    } catch (e: unknown) {
      log(e);
      // return error
      return { status: 'failed', statusCode: 500 } as DataServiceResponse;
    }
  }
}
