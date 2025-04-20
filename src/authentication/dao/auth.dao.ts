import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import IAuthDAO from './auth.dao.interface';
import { DataService } from 'src/shared/services/data.service';
import { OAuthEntity } from './oauth.entity';
import { LocalAuthEntity } from './localauth.entity';
import { DataServiceCondition, ResponseObject } from '../../shared/types';
import { Role } from '../utils/helper';
import { auth } from 'firebase-admin';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthDAO implements IAuthDAO {
  private readonly collectionName = 'authentication';

  constructor(private readonly dataService: DataService) {}

  // Expose a public method for doc ID generation
  async generateNewAuthUID(): Promise<string> {
    return this.dataService.getDocId(this.collectionName);
  }

  /**
   * CREATE (Local)
   * Creates a Firebase Auth user and stores auth data in Firestore
   */
  async createLocalAuth(
    authEntity: LocalAuthEntity,
    password: string,
  ): Promise<ResponseObject> {
    try {
      // Validate password before creation
      if (password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }
      // 1. Create Firebase Auth user
      const userRecord = await this.dataService.createUser({
        uid: authEntity.uId,
        email: authEntity.emailAddress,
        password: password,
        disabled: false,
      });
      console.log('Creating auth with UID:', authEntity.uId);
      // 2. Store additional auth data in Firestore
      const result = await this.dataService.createDoc(
        authEntity,
        this.collectionName,
        true,
      );

      return {
        status: 'success',
        code: 201,
        message: 'Local auth created successfully',
        data: {
          uid: userRecord.uid,
          firestore: result.data,
        },
      };
    } catch (error) {
      // Comprehensive cleanup
      await this.cleanupFailedCreation(authEntity.uId);

      // Convert Firebase errors to proper HTTP exceptions
      switch (error.code) {
        case 'auth/email-already-exists':
          throw new ConflictException('Email already in use');
        case 'auth/invalid-email':
          throw new BadRequestException('Invalid email format');
        case 'auth/weak-password':
          throw new BadRequestException('Password too weak');
        default:
          throw new InternalServerErrorException('User creation failed');
      }
    }
  }
  private async cleanupFailedCreation(uid: string) {
    try {
      // Delete from Firebase Auth if exists
      await this.dataService.deleteUser(uid).catch(() => {});

      // Delete from Firestore if exists
      await this.dataService
        .deleteDoc(this.collectionName, uid)
        .catch(() => {});
    } catch (cleanupError) {
      Logger.error('Cleanup failed for uid ' + uid, cleanupError);
    }
  }

  /**
   * CREATE (OAuth)
   * For Google Sign-In, we'll typically verify the ID token first
   */
  async createOAuthAuth(
    authEntity: OAuthEntity,
    idToken?: string,
  ): Promise<ResponseObject> {
    try {
      if (idToken) {
        // Verify the ID token first
        const decodedToken = await this.verifyIdToken(idToken);

        // Update the authEntity with verified info
        authEntity.uId = decodedToken.uId;
        authEntity.emailAddress = decodedToken.email || authEntity.emailAddress;
      }

      // Create the Firestore record
      const result = await this.dataService.createDoc(
        authEntity,
        this.collectionName,
        true,
      );

      return {
        status: 'success',
        code: 201,
        message: 'OAuth auth created successfully',
        data: result.data,
      };
    } catch (error) {
      return {
        status: 'failure',
        code: error.code,
        message: error.message,
        data: null,
      };
    }
  }

  /**
   * FIND LOCAL by UID
   * Looks for a document with uid == {uid} AND authType == "local".
   */
  async findLocalAuthByUID(uid: string): Promise<LocalAuthEntity | null> {
    const conditions: DataServiceCondition[] = [
      { fieldPath: 'uid', operationString: '==', value: uid },
      { fieldPath: 'authType', operationString: '==', value: 'local' },
    ];

    const result = await this.dataService.readDocsWithConditions(
      this.collectionName,
      conditions,
    );
    console.log('Firestore query result:', result);

    if (
      result.status !== 'success' ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      return null;
    }

    const doc = result.data[0];
    return new LocalAuthEntity(
      doc.uid,
      doc.emailAddress,
      doc.password,
      doc.role,
      doc.createdAt ? new Date(doc.createdAt) : new Date(),
      doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      doc.lastLoginDate ? new Date(doc.lastLoginDate) : undefined,
      doc.failedLoginAttempts,
    );
  }

  /**
   * FIND LOCAL by userName
   * Looks for a document with userName == {userName} AND authType == "local".
   */
  async findLocalAuthByEmail(email: string): Promise<LocalAuthEntity | null> {
    const conditions: DataServiceCondition[] = [
      { fieldPath: 'emailAddress', operationString: '==', value: email },
      { fieldPath: 'authType', operationString: '==', value: 'local' },
    ];

    const result = await this.dataService.readDocsWithConditions(
      this.collectionName,
      conditions,
    );

    if (
      result.status !== 'success' ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      return null;
    }

    const doc = result.data[0];
    return new LocalAuthEntity(
      doc.uid,
      doc.emailAddress,
      doc.password,
      doc.role,
      doc.createdAt ? new Date(doc.createdAt) : new Date(),
      doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      doc.lastLoginDate ? new Date(doc.lastLoginDate) : undefined,
      doc.failedLoginAttempts,
    );
  }

  /**
   * FIND OAUTH by UID
   * Looks for a document with uid == {uid} AND authType == "oauth".
   */
  async findOAuthByUID(uid: string): Promise<OAuthEntity | null> {
    const conditions: DataServiceCondition[] = [
      { fieldPath: 'uid', operationString: '==', value: uid },
      { fieldPath: 'authType', operationString: '==', value: 'oauth' },
    ];

    const result = await this.dataService.readDocsWithConditions(
      this.collectionName,
      conditions,
    );

    if (
      result.status !== 'success' ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      return null;
    }

    const doc = result.data[0];
    return new OAuthEntity(
      doc.uid,
      doc.emailAddress,
      doc.provider,
      doc.token,
      doc.role,
      doc.createdAt ? new Date(doc.createdAt) : undefined,
      doc.updatedAt ? new Date(doc.updatedAt) : undefined,
      doc.lastLoginDate ? new Date(doc.lastLoginDate) : undefined,
    );
  }

  /**
   * FIND OAUTH by emailAddress
   * Looks for a document with emailAddress == {emailAddress} AND authType == "oauth".
   */
  async findOAuthByEmail(emailAddress: string): Promise<OAuthEntity | null> {
    const conditions: DataServiceCondition[] = [
      { fieldPath: 'emailAddress', operationString: '==', value: emailAddress },
      { fieldPath: 'authType', operationString: '==', value: 'oauth' },
    ];

    const result = await this.dataService.readDocsWithConditions(
      this.collectionName,
      conditions,
    );

    if (
      result.status !== 'success' ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      return null;
    }

    const doc = result.data[0];
    return new OAuthEntity(
      doc.uid,
      doc.emailAddress,
      doc.provider,
      doc.token,
      doc.role,
      doc.createdAt ? new Date(doc.createdAt) : undefined,
      doc.updatedAt ? new Date(doc.updatedAt) : undefined,
      doc.lastLoginDate ? new Date(doc.lastLoginDate) : undefined,
    );
  }

  /**
   * UPDATE (Local)
   * Updates both Firebase Auth and Firestore data
   */
  async updateLocalAuth(
    authEntity: LocalAuthEntity,
    password?: string,
  ): Promise<ResponseObject> {
    try {
      // Update Firebase Auth user
      const updateRequest: auth.UpdateRequest = {
        email: authEntity.emailAddress,
        ...(password && { password }), // Only update password if provided
      };

      // Explicitly specify we're updating by UID
      await this.dataService.updateUser(authEntity.uId, updateRequest);

      // Update Firestore data
      const updatedData = {
        ...authEntity.toObject(),
        authType: 'local',
      };
      const result = await this.dataService.updateDoc(
        this.collectionName,
        authEntity.uId,
        updatedData,
      );

      return result;
    } catch (error) {
      return {
        status: 'failure',
        code: error.code,
        message: error.message,
        data: null,
      };
    }
  }

  /**
   * UPDATE (OAuth)
   * Updates OAuth auth data in Firestore
   */
  async updateOAuthAuth(authEntity: OAuthEntity): Promise<ResponseObject> {
    try {
      const updatedData = {
        ...authEntity.toObject(),
        authType: 'oauth',
      };

      const result = await this.dataService.updateDoc(
        this.collectionName,
        authEntity.uId,
        updatedData,
      );

      return result;
    } catch (error) {
      return {
        status: 'failure',
        code: error.code,
        message: error.message,
        data: null,
      };
    }
  }

  /**
   * DELETE
   * Removes both Firebase Auth user and Firestore document
   */
  async deleteAuth(uid: string): Promise<ResponseObject> {
    try {
      // Delete Firebase Auth user
      await this.dataService.deleteUser(uid);

      // Delete Firestore document
      const result = await this.dataService.deleteDoc(this.collectionName, uid);

      return result;
    } catch (error) {
      return {
        status: 'failure',
        code: error.code,
        message: error.message,
        data: null,
      };
    }
  }

  /**
   * FIND ANY AUTH (local or oauth) by role
   * This method does NOT differentiate local vs oauth docs. It returns both in a single array.
   * We parse each doc based on its authType field.
   */
  async findAuthByRole(
    role: Role,
  ): Promise<Array<LocalAuthEntity | OAuthEntity>> {
    const condition: DataServiceCondition = {
      fieldPath: 'role',
      operationString: '==',
      value: role,
    };

    const result = await this.dataService.readDocsWithConditions(
      this.collectionName,
      condition,
    );

    if (
      result.status !== 'success' ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      return [];
    }

    // Map each doc to either LocalAuthEntity or OAuthEntity
    return result.data.map((doc: any) => {
      if (doc.authType === 'local') {
        return new LocalAuthEntity(
          doc.uid,
          doc.emailAddress,
          doc.password,
          doc.role,
          doc.createdAt ? new Date(doc.createdAt) : new Date(),
          doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
          doc.lastLoginDate ? new Date(doc.lastLoginDate) : undefined,
          doc.failedLoginAttempts,
        );
      } else {
        // OAuth
        return new OAuthEntity(
          doc.uid,
          doc.emailAddress,
          doc.provider,
          doc.token,
          doc.role,
          doc.createdAt ? new Date(doc.createdAt) : undefined,
          doc.updatedAt ? new Date(doc.updatedAt) : undefined,
          doc.lastLoginDate ? new Date(doc.lastLoginDate) : undefined,
        );
      }
    });
  }
  /**
   * Firebase Auth specific methods
   */

  async verifyIdToken(idToken: string): Promise<auth.DecodedIdToken> {
    return this.dataService.verifyIdToken(idToken);
  }

  async setCustomUserClaims(
    uid: string,
    claims: Record<string, any>,
  ): Promise<void> {
    return this.dataService.setCustomUserClaims(uid, claims);
  }

  async getUserByEmail(email: string): Promise<auth.UserRecord | null> {
    try {
      return await this.dataService.getUserByEmail(email);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return null;
      }
      throw error;
    }
  }

  async createCustomToken(
    uid: string,
    developerClaims?: Record<string, any>,
  ): Promise<string> {
    try {
      const customToken = await this.dataService.createCustomToken(
        uid,
        developerClaims,
      );
      return customToken;
    } catch (error) {
      throw new Error(`Error creating custom token: ${error}`);
    }
  }

  // auth.dao.ts

  async signInWithCustomToken(customToken: string): Promise<string> {
    return this.dataService.signInWithCustomToken(customToken);
  }

  async generateIdToken(
    uid: string,
    claims?: Record<string, any>,
  ): Promise<string> {
    return this.dataService.generateIdToken(uid, claims);
  }

  // auth.dao.ts

  /**
   * Gets a Firebase user by UID
   * @param uid User ID
   * @returns Promise with user record
   */
  async getUser(uid: string): Promise<auth.UserRecord> {
    try {
      return await this.dataService.getUser(uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundException(`User with uid ${uid} not found`);
      }
      throw new InternalServerErrorException('Failed to get user');
    }
  }

  /**
   * Creates a new Firebase user
   * @param userProperties User properties to create
   * @returns Promise with user record
   */
  async createUser(
    userProperties: auth.CreateRequest,
  ): Promise<auth.UserRecord> {
    try {
      return await this.dataService.createUser(userProperties);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new ConflictException('Email already in use');
      }
      if (error.code === 'auth/invalid-email') {
        throw new BadRequestException('Invalid email format');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Add this method to the AuthDAO class
  async revokeRefreshTokens(uid: string): Promise<void> {
    return this.dataService.revokeRefreshTokens(uid);
  }

  async storeRefreshToken(uid: string, token: string): Promise<void> {
    await this.dataService.updateDoc(this.collectionName, uid, {
      refreshTokens: admin.firestore.FieldValue.arrayUnion(token),
    });
  }

  async validateRefreshToken(uid: string, token: string): Promise<boolean> {
    const result = await this.dataService.readDoc(this.collectionName, uid);

    if (result.status !== 'success' || !result.data) {
      return false;
    }

    const userData = result.data as any;
    return userData.refreshTokens?.includes?.(token) ?? false;
  }
}
