import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from '../firebase/firebase.service';
import {
  DocumentData,
  DocumentReference,
  FirebaseFirestoreError,
  Firestore,
  WriteBatch,
  WriteResult,
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
    @returns A [DataServiceResponse] containing the status and document path of the created document.
  */
  async createRecord(
    data: object,
    collectionName: string,
  ): Promise<DataServiceResponse> {
    try {
      // adding data to collection
      const result: DocumentReference = await this.firestore
        .collection(collectionName)
        .add(data);

      // return success status
      // .path -> A string representing the path of the referenced document (relative to the root of the database).
      return {
        status: 'success',
        message: 'Document successfully created.',
        data: [result.path],
      } as DataServiceResponse;
    } catch (e: unknown) {
      // log error
      log((e as FirebaseFirestoreError).code);

      // return error
      return {
        status: (e as FirebaseFirestoreError).code,
        message: (e as FirebaseFirestoreError).message,
        data: null,
      } as DataServiceResponse;
    }
  }

  /**
    Creates multiple documents on firestore.
    @param data[] A list of objects representing each document's data.
    @param path Firestore path where the documents should be stored.
    @returns A [DataServiceResponse] containing the status and status code. If successful, status code is 200 other wise its different.
  */
  async createRecords(
    data: object[],
    collectionName: string,
  ): Promise<DataServiceResponse> {
    try {
      // instantiate a batch
      const batch: WriteBatch = this.firestore.batch();

      // adding write tasks for each data
      data.forEach((docData) => {
        // create a document reference for the current doc
        const docRef: DocumentReference = this.firestore
          .collection(collectionName)
          .doc(); // this generates a unique id

        // add document and data to batch
        batch.set(docRef, docData);
      });

      // commit batch job: All writes are committed as a single write job
      await batch.commit();

      // return success status
      return {
        status: 'success',
        message: 'Documents created successfully',
        data: batch['_ops'].map((doc: object) => doc['docPath']),
      } as DataServiceResponse;
    } catch (e: unknown) {
      log(e);
      // return error
      return {
        status: (e as FirebaseFirestoreError).code,
        message: (e as FirebaseFirestoreError).message,
        data: null,
      } as DataServiceResponse;
    }
  }
}
