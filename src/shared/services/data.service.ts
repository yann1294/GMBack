import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from '../firebase/firebase.service';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  FirebaseFirestoreError,
  Firestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
  WriteBatch,
} from 'firebase-admin/firestore';
import { log } from 'console';
import { DataServiceCondition, ResponseObject } from 'src/shared/types';
import { Tour } from 'src/tours/dao/tour.entity';
import { Package } from 'src/tours/dao/package.entity';
import { Booking } from 'src/booking/dao/booking.entity';
import { Tourist } from 'src/user-management/dao/tourist.entity';
import { Guide } from 'src/user-management/dao/guide.entity';
import { Admin } from 'src/user-management/dao/admin.entity';

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
   * @returns A promise that resolves to a ResponseObject containing the error message.
   */
  private errorHandler(e: unknown): ResponseObject {
    const error = e as FirebaseFirestoreError;
    log(`Error: ${error.code}`);
    return {
      status: 'failure',
      code: error.code,
      message: error.message,
      data: null,
    };
  }

  getDocId(collectionName: string): string { 
    return this.firestore.collection(collectionName).doc().id;
  }

  /**
   * Creates a document in a Firestore collection.
   *
   * @param collectionName - The Firestore collection name or path for the document.
   * @param data - The data to be stored in the document.
   * @returns A promise that resolves to a ResponseObject containing the document ID or an error message.
   */
  async createDoc(
    data: Tour | Package | Booking | Admin | Guide | Tourist,
    collectionName: string,
    useUid: boolean = false,
  ): Promise<ResponseObject> {
    try {
      // create doc to auto generate doc id
      const doc: DocumentReference = useUid ? this.firestore
        .collection(collectionName)
        .doc(data['uid']) :  this.firestore
        .collection(collectionName)
        .doc();

      // update data with doc id/uid
      if (!useUid) {
        data['id'] = doc.id;
      }

      // adding data to doc
      await doc.set(data.toObject());

      // return success status
      // .path -> A string representing the path of the referenced document (relative to the root of the database).
      return {
        status: 'success',
        message: 'Document successfully created.',
        data: doc.path,
      } as ResponseObject;
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
   * @returns A promise that resolves to a ResponseObject containing document IDs or an error message.
   */
  async createDocs(
    data: object[],
    collectionName: string,
  ): Promise<ResponseObject> {
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

        // add id to data
        if (Object.keys(data).includes('uid')) {
          docData['uid'] = docRef.id;
        } else {
          docData['id'] = docRef.id;
        }


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
      } as ResponseObject;
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
   * @returns A promise that resolves to a ResponseObject containing the document data or an error message.
   */
  async readDoc(
    collectionName: string,
    docId: string,
  ): Promise<ResponseObject> {
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
        data: result.data(),
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
   * @returns A promise that resolves to a ResponseObject containing documents or an error message.
   */
  async readAllDocs(collectionName: string): Promise<ResponseObject> {
    try {
      // read specific document
      const results: QuerySnapshot = await this.firestore
        .collection(collectionName)
        .get();

      // return document data
      return {
        status: 'success',
        code: 200,
        message: 'Successfully feteched documents.',
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
  async readDocsWithConditions(
    collectionName: string,
    conditions: DataServiceCondition | DataServiceCondition[], // Can be a single condition or an array
  ): Promise<ResponseObject> {
    try {
      // Initialize query with collection reference
      let query: FirebaseFirestore.Query = this.firestore.collection(collectionName);

      // If conditions is a single object, make it an array
      const conditionsArray = Array.isArray(conditions) ? conditions : [conditions];

      // Loop through each condition and apply it to the query
      conditionsArray.forEach((condition) => {
        query = query.where(condition.fieldPath, condition.operationString, condition.value);
      });

      // Execute the query
      const results: QuerySnapshot = await query.get();

      // Return document data
      return {
        status: 'success',
        message: 'Successfully fetched document.',
        data: results.docs.map((doc: QueryDocumentSnapshot) => doc.data()),
      } as ResponseObject;
    } catch (e: unknown) {
      // Return error
      return this.errorHandler(e);
    }
  }

  // async readDocsWithCondition(
  //   collectionName: string,
  //   condition: DataServiceCondition,
  // ): Promise<ResponseObject> {
  //   try {
  //     // read specific document
  //     const results: QuerySnapshot = await this.firestore
  //       .collection(collectionName)
  //       .where(condition.fieldPath, condition.operationString, condition.value)
  //       .get();

  //     // return document data
  //     return {
  //       status: 'success',
  //       message: 'Successfully feteched document.',
  //       data: results.docs.map((doc: QueryDocumentSnapshot) => doc.data()),
  //     } as ResponseObject;
  //   } catch (e: unknown) {
  //     // return error
  //     return this.errorHandler(e);
  //   }
  // }

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
        data: docId,
      } as ResponseObject;
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
  ): Promise<ResponseObject> {
    try {
      // checking whether doc exist
      let docRef: DocumentReference = await this.firestore
        .collection(collectionName)
        .doc(docId);

      // checking whether document exist
      if (!(await docRef.get()).exists) {
        return {
          status: 'not-found',
          code: 404,
          message: 'Document not found.',
          data: null,
        };
      }

      // update document
      docRef.set(newData, { merge: true });

      return {
        status: 'success',
        message: 'Document updated successfully',
        data: docId,
      } as ResponseObject;
    } catch (e) {
      return this.errorHandler(e);
    }
  }
}
