import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { Payment } from 'src/payment/dao/payment.entity';
import { LocalAuthEntity } from 'src/authentication/dao/localauth.entity';
import { OAuthEntity } from 'src/authentication/dao/oauth.entity';
import { auth } from 'firebase-admin';
import axios from 'axios';
import { stripUndefinedDeep } from '../utils/stripUndefined';
import { instanceToPlain } from 'class-transformer';

export function errorHandler(e: unknown): ResponseObject {
  const error = e as FirebaseFirestoreError;
  log(`Error: ${error}`);
  return {
    status: 'failure',
    code: error.code,
    message: error.message,
    data: null,
  };
}
// tiny helper so we don’t double-plain
function isPlainJSONish(v: any) {
  return (
    v && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype
  );
}
const isPlainObject = (val: unknown): val is Record<string, unknown> => {
  if (Object.prototype.toString.call(val) !== '[object Object]') return false;
  const proto = Object.getPrototypeOf(val);
  return proto === Object.prototype || proto === null;
};

@Injectable()
export class DataService {
  // holds firestore object from repository
  firestore: Firestore;

  //holds firebase auth object
  auth: auth.Auth;

  constructor(firebaseRepository: FirebaseRepository) {
    // assigning firestore reference from firebase repository
    this.firestore = firebaseRepository.guideMeDb;
    // assigning auth reference from firebase repository
    this.auth = firebaseRepository.auth;
  }

  /**
   * Logs and returns DataService errors.
   *
   * @param e - Error object.
   * @returns A promise that resolves to a ResponseObject containing the error message.
   */

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
    data:
      | Tour
      | Package
      | Booking
      | Admin
      | Guide
      | Tourist
      | Payment
      | LocalAuthEntity
      | OAuthEntity,
    collectionName: string,
    useUid = false,
  ): Promise<ResponseObject> {
    try {
      // Convert entity to a plain object (no mutation of `data`)
      const plain =
        data.toObject?.() ?? (data as unknown as Record<string, unknown>);

      const col = this.firestore.collection(collectionName);

      // Decide the document reference (UID vs auto ID)
      let doc: DocumentReference;
      if (useUid) {
        const uid = String((plain as any).uid ?? '');
        if (!uid) {
          return {
            status: 'failure',
            code: 400,
            message: 'Missing uid for createDoc with useUid=true',
            data: null,
          };
        }
        doc = col.doc(uid);
      } else {
        doc = col.doc(); // auto-generate id
      }

      // Build payload without mutating original; inject id when not using uid
      const payloadBase: Record<string, unknown> = {
        ...plain,
        ...(useUid ? {} : { id: doc.id }),
      };

      // Deep-remove undefined values safely (cycle-safe, preserves non-plain objects)
      const payload = stripUndefinedDeep(payloadBase);

      // Write
      await doc.set(payload);

      // Return what we actually wrote (including id/uid)
      return {
        status: 'success',
        code: 200,
        message: 'Document successfully created.',
        data: payload,
      };
    } catch (e) {
      return errorHandler(e);
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
    data: unknown[],
    collectionName: string,
  ): Promise<ResponseObject> {
    try {
      const batch: WriteBatch = this.firestore.batch();
      const docRefs: string[] = [];

      data.forEach((raw) => {
        const docRef: DocumentReference = this.firestore
          .collection(collectionName)
          .doc();

        // Decide which field to set (uid vs id) based on the shape of the item
        const hasUidKey =
          raw &&
          typeof raw === 'object' &&
          Object.prototype.hasOwnProperty.call(raw, 'uid');
        const idField = hasUidKey ? 'uid' : 'id';

        // Normalize class instances -> plain, but don’t touch non-plain (FieldValue etc.)
        const plain = isPlainObject(raw)
          ? (raw as Record<string, unknown>)
          : instanceToPlain(raw, { exposeUnsetFields: false });

        // Build the payload without mutating the original
        const payload = stripUndefinedDeep({
          ...plain,
          [idField]: docRef.id, // write back generated id
        });

        batch.set(docRef, payload);
        docRefs.push(docRef.path);
      });

      await batch.commit();

      return {
        status: 'success',
        code: 200,
        message: 'Documents created successfully',
        data: docRefs, // full document paths; switch to docRef.id if you only want IDs
      };
    } catch (e) {
      return errorHandler(e);
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
      return errorHandler(e);
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
      return errorHandler(e);
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
      let query: FirebaseFirestore.Query =
        this.firestore.collection(collectionName);

      // If conditions is a single object, make it an array
      const conditionsArray = Array.isArray(conditions)
        ? conditions
        : [conditions];

      // Loop through each condition and apply it to the query
      conditionsArray.forEach((condition) => {
        query = query.where(
          condition.fieldPath,
          condition.operationString,
          condition.value,
        );
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
      return errorHandler(e);
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
  //     return errorHandler(e);
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
      return errorHandler(e);
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
    collection: string,
    id: string,
    data: any,
  ): Promise<ResponseObject> {
    const ref = this.firestore.collection(collection).doc(id);

    // 1) normalize class instances → plain
    const plain = isPlainJSONish(data)
      ? data
      : instanceToPlain(data, { exposeUnsetFields: false });
    // 2) deep-strip undefined safely
    const cleaned = stripUndefinedDeep(plain);

    try {
      await ref.update(cleaned);
      return { status: 'success', code: 200, message: 'OK', data: null };
    } catch (e: any) {
      if (e.code === 5 /* NOT_FOUND */) {
        await ref.set(cleaned, { merge: true });
        return {
          status: 'success',
          code: 200,
          message: 'OK (created)',
          data: null,
        };
      }
      return {
        status: 'failure',
        code: e.code || 500,
        message: e.message,
        data: null,
      };
    }
  }

  /**
   * Firebase Auth methods
   */

  /**
   * Creates a new Firebase user
   * @param userProperties User properties to create
   * @returns Promise with user record
   */
  async createUser(
    userProperties: auth.CreateRequest,
  ): Promise<auth.UserRecord> {
    return this.auth.createUser(userProperties);
  }

  /**
   * Gets a Firebase user by UID
   * @param uid User ID
   * @returns Promise with user record
   */
  async getUser(uid: string): Promise<auth.UserRecord> {
    return this.auth.getUser(uid);
  }

  /**
   * Gets a Firebase user by email
   * @param email Email
   * @returns Promise with user record
   */

  async getUserByEmail(email: string): Promise<auth.UserRecord> {
    return this.auth.getUserByEmail(email);
  }

  /**
   * Updates a Firebase user
   * @param uid User ID
   * @param properties Properties to update
   * @returns Promise with updated user record
   */
  async updateUser(
    uid: string,
    properties: auth.UpdateRequest,
  ): Promise<auth.UserRecord> {
    return this.auth.updateUser(uid, properties);
  }

  /**
   * Deletes a Firebase user
   * @param uid User ID
   * @returns Promise that resolves when user is deleted
   */
  async deleteUser(uid: string): Promise<void> {
    return this.auth.deleteUser(uid);
  }

  /**
   * Sets custom claims on a user
   * @param uid User ID
   * @param customClaims Custom claims object
   * @returns Promise that resolves when claims are set
   */
  async setCustomUserClaims(
    uid: string,
    customClaims: Record<string, any>,
  ): Promise<void> {
    return this.auth.setCustomUserClaims(uid, customClaims);
  }

  /**
   * Verifies a Firebase ID token
   * @param idToken The Firebase ID token
   * @returns Promise with decoded token
   */
  async verifyIdToken(idToken: string): Promise<auth.DecodedIdToken> {
    return this.auth.verifyIdToken(idToken);
  }

  /**
   * Creates a custom token for a user
   * @param uid User ID
   * @param additionalClaims Optional additional claims
   * @returns Promise with custom token
   */
  async createCustomToken(
    uid: string,
    additionalClaims?: object,
  ): Promise<string> {
    return this.auth.createCustomToken(uid, additionalClaims);
  }

  // data.service.ts

  /**
   * Signs in with custom token to get ID token
   * @param customToken The custom token to exchange
   * @returns Promise with ID token
   */
  async signInWithCustomToken(customToken: string): Promise<string> {
    const { uid, claims } = await this.auth.verifyIdToken(customToken);
    const idToken = await this.auth.createCustomToken(uid, claims);
    return idToken;
  }

  /**
   * Generates ID token for testing
   * @param uid User ID
   * @param claims Optional claims
   * @returns Promise with ID token
   */
  async generateIdToken(
    uid: string,
    claims?: Record<string, any>,
  ): Promise<string> {
    // 1. Create custom token
    const customToken = await this.createCustomToken(uid, claims);

    // 2. Exchange for ID token
    return this.signInWithCustomToken(customToken);
  }

  /**
   * Generates a Firebase ID token for a given UID (and optional custom claims)
   * by:
   *  1) creating a custom token via the Admin SDK
   *  2) exchanging it for an ID token with the REST endpoint
   */
  // async generateIdToken(
  //   uid: string,
  //   claims?: Record<string, any>,
  // ): Promise<string> {
  //   // 1) create the custom token
  //   const customToken = await this.createCustomToken(uid, claims);

  //   // 2) exchange it for an ID token
  //   const apiKey = process.env.FIREBASE_WEB_API_KEY;
  //   if (!apiKey) {
  //     throw new InternalServerErrorException(
  //       'FIREBASE_WEB_API_KEY environment variable is required',
  //     );
  //   }

  //   const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;
  //   const response = await axios
  //     .post<{
  //       idToken: string;
  //       refreshToken: string;
  //       expiresIn: string;
  //     }>(url, {
  //       token: customToken,
  //       returnSecureToken: true,
  //     })
  //     .catch((err) => {
  //       throw new InternalServerErrorException(
  //         `Failed to exchange custom token: ${err.response?.data?.error?.message || err.message}`,
  //       );
  //     });

  //   return response.data.idToken;
  // }

  async revokeRefreshTokens(uid: string): Promise<void> {
    await this.auth.revokeRefreshTokens(uid);
  }
}
