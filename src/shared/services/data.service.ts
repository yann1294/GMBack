import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from '../firebase/firebase.service';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
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
    Creates a document in a firestore collection.
    @param data The data to be stored in the document.
    @param collectionName Firestore collection name or collection path where the documents should be created.
    @returns A [DataServiceResponse] containing the status and document path of the created document.
  */
  async createDoc(
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
    Creates multiple documents in a firebase collection.
    @param data[] A list of objects representing each document's data.
    @param collectionName Firestore collection name or collection path where the documentions should be created.
    @returns A [DataServiceResponse] containing the status and document paths of the created documents.
    data is empty in case of an error.
*/
  async createDocs(
    data: object[],
    collectionName: string,
  ): Promise<DataServiceResponse> {
    try {
      // instantiate a batch
      // By using a batch, we can automatically group multiple
      // operations and execute them as one package thus multiple writes
      // in a batch will be recognized as a single write operation.
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
      // commit(): returns WriteResult which contains only the write time.
      // To get the document ids, we have to use the WriteBatch object from batch.set().
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

  /**
  Reads a specific firestore document from a given collection.

  @param collectionName Firestore collection name/path from which the document should be read.
  @param docId The id of the document to be read.
  */
  async readDoc(
    collectionName: string,
    docId: string,
  ): Promise<DataServiceResponse> {
    try {
      // read specific document
      const result: DocumentSnapshot = await this.firestore
        .collection(collectionName)
        .doc(docId)
        .get();

      // return document data
      return {
        status: 'success',
        message: 'Successfully feteched document.',
        data: [result.data()],
      };
    } catch (e: unknown) {
      // log error
      log((e as FirebaseFirestoreError).code);
      return {
        status: (e as FirebaseFirestoreError).code,
        message: (e as FirebaseFirestoreError).message,
        data: null,
      } as DataServiceResponse;
    }
  }
}
