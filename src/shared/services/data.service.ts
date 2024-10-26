import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from '../firebase/firebase.service';
import {
  DocumentReference,
  DocumentSnapshot,
  FirebaseFirestoreError,
  Firestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
  WriteBatch,
} from 'firebase-admin/firestore';
import { log } from 'console';
import { DataServiceCondition, DataServiceResponse } from 'src/types';

@Injectable()
export class DataService {
  // holds firestore object from repository
  firestore: Firestore;

  constructor(firebaseRepository: FirebaseRepository) {
    // assigning firestore reference from firebase repository
    this.firestore = firebaseRepository.guideMeDb;
  }

  /**
   * Logs and returns DataService errors.
   *
   * @param e - Error object.
   * @returns A promise that resolves to a DataServiceResponse containing the error message.
   */
  private errorHandler(e: unknown): DataServiceResponse {
    const error = e as FirebaseFirestoreError;
    log(`Error: ${error.code}`);
    return {
      status: 'failure',
      code: error.code,
      message: error.message,
      data: null,
    };
  }

  /**
   * Creates a document in a Firestore collection.
   *
   * @param collectionName - The Firestore collection name or path for the document.
   * @param data - The data to be stored in the document.
   * @returns A promise that resolves to a DataServiceResponse containing the document ID or an error message.
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
      // return error
      return this.errorHandler(e);
    }
  }

  /**
   * Creates multiple documents in a Firebase collection.
   *
   * @param collectionName - The Firestore collection name or path for the documents.
   * @param data[] - A list of data to be stored in each document.
   * @returns A promise that resolves to a DataServiceResponse containing document IDs or an error message.
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

      // holds document references
      let docRefs: string[];

      // adding write tasks for each data
      data.forEach((docData) => {
        // create a document reference for the current doc
        const docRef: DocumentReference = this.firestore
          .collection(collectionName)
          .doc(); // this generates a unique id

        // add document and data to batch
        batch.set(docRef, docData);

        // save doc ref
        docRefs.push(docRef.path);
      });

      // commit batch job: All writes are committed as a single write job
      await batch.commit();

      // return success status
      // commit(): returns WriteResult which contains only the write time.
      // To get the document ids, we have to use the WriteBatch object from batch.set().
      return {
        status: 'success',
        message: 'Documents created successfully',
        data: docRefs,
      } as DataServiceResponse;
    } catch (e: unknown) {
      // return error
      return this.errorHandler(e);
    }
  }

  /**
   * Read a document from a Firestore collection.
   *
   * @param collectionName - The Firestore collection name or path for the document.
   * @param docId - The id of the document to be read.
   * @returns A promise that resolves to a DataServiceResponse containing the document data or an error message.
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

      // check whether document exists
      if (!result.exists) {
        return {
          status: 'not-found',
          code: 404,
          message: 'Document not found.',
          data: null,
        };
      }

      // return document data
      return {
        status: 'success',
        code: 200,
        message: 'Successfully feteched document.',
        data: [result.data()],
      };
    } catch (e: unknown) {
      // return error
      return this.errorHandler(e);
    }
  }

  /**
   * Reads all documents in a given Firestore collection.
   *
   * @param collectionName - The Firestore collection name or path for the documents.
   * @returns A promise that resolves to a DataServiceResponse containing documents or an error message.
   */
  async readAllDocs(collectionName: string): Promise<DataServiceResponse> {
    try {
      // read specific document
      const results: QuerySnapshot = await this.firestore
        .collection(collectionName)
        .get();

      // return document data
      return {
        status: 'success',
        code: 200,
        message: 'Successfully feteched document.',
        data: results.docs.map((doc: QueryDocumentSnapshot) => doc.data()),
      };
    } catch (e: unknown) {
      // return error
      return this.errorHandler(e);
    }
  }

  /**
   * Reads documents in a collection based on a given condition.
   *
   * @param collectionName - The Firestore collection name or path.
   * @param condition - A `DataServiceCondition` object specifying the retrieval conditions.
   * @returns A promise resolving to the documents that fulfill the condition or an error object on failure.
   */
  async readDocsWithCondition(
    collectionName: string,
    condition: DataServiceCondition,
  ) {
    try {
      // read specific document
      const results: QuerySnapshot = await this.firestore
        .collection(collectionName)
        .where(condition.fieldPath, condition.operationString, condition.value)
        .get();

      // return document data
      return {
        status: 'success',
        message: 'Successfully feteched document.',
        data: results.docs.map((doc: QueryDocumentSnapshot) => doc.data()),
      };
    } catch (e: unknown) {
      // return error
      return this.errorHandler(e);
    }
  }

  /**
   * Deletes a specific document from a given collection.
   *
   * @param collectionName - The collection name or path from which to delete the document.
   * @param docId - The ID of the document to be deleted.
   * @returns A promise resolving to the ID of the deleted document or an error on failure.
   */
  async deleteDoc(collectionName: string, docId: string) {
    try {
      // delete document
      await this.firestore.collection(collectionName).doc(docId).delete();

      return {
        status: 'success',
        message: 'Document deleted successfully',
        data: [docId],
      } as DataServiceResponse;
    } catch (e) {
      return this.errorHandler(e);
    }
  }

  /**
   * Updates a specific document in a given collection.
   *
   * @param collectionName - The collection name or path where the document is located.
   * @param docId - The ID of the document to be updated.
   * @returns A promise resolving to the ID of the updated document or an error on failure.
   */
  async updateDoc(
    collectionName: string,
    docId: string,
    newData: object,
  ): Promise<DataServiceResponse> {
    try {
      // update document
      await this.firestore
        .collection(collectionName)
        .doc(docId)
        .update(newData);

      return {
        status: 'success',
        message: 'Document updated successfully',
        data: [docId],
      } as DataServiceResponse;
    } catch (e) {
      return this.errorHandler(e);
    }
  }
}
