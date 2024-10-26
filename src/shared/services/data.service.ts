import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from '../firebase/firebase.service';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirebaseFirestoreError,
  Firestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
  WriteBatch,
  WriteResult,
} from 'firebase-admin/firestore';
import { log } from 'console';
import { DataServiceCondition, DataServiceResponse } from 'src/types';
import { DatabaseService } from 'firebase-admin/lib/database/database';

@Injectable()
export class DataService {
  // holds firestore object from repository
  firestore: Firestore;

  constructor(firebaseRepository: FirebaseRepository) {
    // assigning firestore reference from firebase repository
    this.firestore = firebaseRepository.guideMeDb;
  }

  private errorHandler(e: unknown): DataServiceResponse {
    const error = e as FirebaseFirestoreError;
    log(`Error: ${error.code}`);
    return {
      status: error.code,
      message: error.message,
      data: null,
    };
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
      // return error
      return this.errorHandler(e);
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
  Reads a specific firestore document from a given collection.

  @param collectionName Firestore collection name/path from which the document should be read.
  @param docId The id of the document to be read.
  @returns Returns an object containing a success status, message and retreived data. Returns error status in case of
  failure.
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
          message: 'Document not found.',
          data: null,
        };
      }

      // return document data
      return {
        status: 'success',
        message: 'Successfully feteched document.',
        data: [result.data()],
      };
    } catch (e: unknown) {
      // return error
      return this.errorHandler(e);
    }
  }

  /**
  Reads all documents in a given collection.

  @param collectionName Firestore collection name/path from which the document should be read.
  @returns Returns all read documents in a DataServiceResponse object. Or error message in case of failure.
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
        message: 'Successfully feteched document.',
        data: results.docs.map((doc: QueryDocumentSnapshot) => doc.data()),
      };
    } catch (e: unknown) {
      // return error
      return this.errorHandler(e);
    }
  }

  /**
  Reads documents in a collection based on a given condition.

  @param collectionName Firestore collection name/path from which the document should be read.
  @param condition A `DataServiceCondition` object specifying the conditions for retreiving a document.
  @returns Returns all documents that fulfill `condition` or returns error object.
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
  Deletes a specific document from a given collection.

  @param collectionName Collection name/path from which the document should be deleted.
  @param docId Id of the document to be deleted.

  @returns Returns the id of the deleted document or an error in the case of an error.
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
  Updates a specific document from a given collection.

  @param collectionName Collection name/path from which the document should be updated.
  @param docId Id of the document to be deleted.

  @returns Returns the id of the updated document or an error in the case of an error.
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
