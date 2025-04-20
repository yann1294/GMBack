import { LocalAuthEntity } from './localauth.entity';
import { ResponseObject } from '../../shared/types';
import { OAuthEntity } from './oauth.entity';
import { Role } from '../utils/helper';
import { auth } from 'firebase-admin';

export default interface IAuthDAO {
  // Generates a new UID for authentication entities

  generateNewAuthUID(): Promise<string>;
  // Create
  createLocalAuth(
    authEntity: LocalAuthEntity,
    password: string,
  ): Promise<ResponseObject>;
  createOAuthAuth(
    authEntity: OAuthEntity,
    idToken?: string,
  ): Promise<ResponseObject>;

  // Read (Local)
  findLocalAuthByUID(uid: string): Promise<LocalAuthEntity | null>;
  findLocalAuthByEmail(email: string): Promise<LocalAuthEntity | null>;

  // Read (OAuth)
  findOAuthByUID(uid: string): Promise<OAuthEntity | null>;
  findOAuthByEmail(emailAddress: string): Promise<OAuthEntity | null>;

  // Update
  updateLocalAuth(
    authEntity: LocalAuthEntity,
    password?: string,
  ): Promise<ResponseObject>;
  updateOAuthAuth(authEntity: OAuthEntity): Promise<ResponseObject>;

  // Delete (shared, by UID)
  deleteAuth(uid: string): Promise<ResponseObject>;

  // Find any auth doc (local or oauth) with a given role
  findAuthByRole(role: Role): Promise<Array<LocalAuthEntity | OAuthEntity>>;

  // Firebase Auth specific methods
  verifyIdToken(idToken: string): Promise<auth.DecodedIdToken>;
  setCustomUserClaims(uid: string, claims: Record<string, any>): Promise<void>;
  getUserByEmail(email: string): Promise<auth.UserRecord | null>;
  createCustomToken(
    uid: string,
    developerClaims?: Record<string, any>,
  ): Promise<string>;

  // Sign in with custom token
  signInWithCustomToken(customToken: string): Promise<string>;

  // Generate ID token for testing
  generateIdToken(uid: string, claims?: Record<string, any>): Promise<string>;

  getUser(uid: string): Promise<auth.UserRecord>;

  createUser(userProperties: auth.CreateRequest): Promise<auth.UserRecord>;

  revokeRefreshTokens(uid: string): Promise<void>;

  storeRefreshToken(uid: string, token: string): Promise<void>;

  validateRefreshToken(uid: string, token: string): Promise<boolean>;
}
