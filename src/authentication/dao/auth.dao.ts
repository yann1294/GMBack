import { Injectable } from '@nestjs/common';
import IAuthDAO from './auth.dao.interface';
import { DataService } from 'src/shared/services/data.service';
import { OAuthEntity } from './oauth.entity';
import { LocalAuthEntity } from './localauth.entity';
import { DataServiceCondition, ResponseObject } from '../../shared/types';
import { Role } from '../utils/helper';

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
   * Stores a new LocalAuthEntity document in Firestore with authType = "local".
   */
  async createLocalAuth(authEntity: LocalAuthEntity): Promise<ResponseObject> {
    // Use Firestore document ID = authEntity.uid
    return this.dataService.createDoc(authEntity, this.collectionName, true);
  }

  /**
   * CREATE (OAuth)
   * Stores a new OAuthEntity document in Firestore with authType = "oauth".
   */
  async createOAuthAuth(authEntity: OAuthEntity): Promise<ResponseObject> {
    // Use Firestore document ID = authEntity.uid
    return this.dataService.createDoc(authEntity, this.collectionName, true);
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
  async findLocalAuthByEmail(
    email: string,
  ): Promise<LocalAuthEntity | null> {
    const conditions: DataServiceCondition[] = [
      { fieldPath: 'email', operationString: '==', value: email },
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
      doc.accessToken,
      doc.refreshToken,
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
      doc.accessToken,
      doc.refreshToken,
      doc.role,
      doc.createdAt ? new Date(doc.createdAt) : undefined,
      doc.updatedAt ? new Date(doc.updatedAt) : undefined,
      doc.lastLoginDate ? new Date(doc.lastLoginDate) : undefined,
    );
  }

  /**
   * UPDATE (Local)
   * Uses uid as document ID. Merges or overwrites data in Firestore.
   */
  async updateLocalAuth(authEntity: LocalAuthEntity): Promise<ResponseObject> {
    const updatedData = {
      ...authEntity.toObject(),
      authType: 'local',
    };
    return this.dataService.updateDoc(
      this.collectionName,
      authEntity.uid,
      updatedData,
    );
  }

  /**
   * UPDATE (OAuth)
   * Uses uid as document ID. Merges or overwrites data in Firestore.
   */
  async updateOAuthAuth(authEntity: OAuthEntity): Promise<ResponseObject> {
    const updatedData = {
      ...authEntity.toObject(),
      authType: 'oauth',
    };
    return this.dataService.updateDoc(
      this.collectionName,
      authEntity.uid,
      updatedData,
    );
  }

  /**
   * DELETE
   * Removes a document by UID (local or oauth).
   */
  async deleteAuth(uid: string): Promise<ResponseObject> {
    return this.dataService.deleteDoc(this.collectionName, uid);
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
          doc.accessToken,
          doc.refreshToken,
          doc.role,
          doc.createdAt ? new Date(doc.createdAt) : undefined,
          doc.updatedAt ? new Date(doc.updatedAt) : undefined,
          doc.lastLoginDate ? new Date(doc.lastLoginDate) : undefined,
        );
      }
    });
  }
}
