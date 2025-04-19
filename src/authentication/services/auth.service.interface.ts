import { ResponseObject } from '../../shared/types';
import { AuthResponseDTO } from '../controller/dto/auth.response.dto';
import { AuthUpdateDTO } from '../controller/dto/auth.update.dto';
import { LocalAuthEntity } from '../dao/localauth.entity';
import { OAuthEntity } from '../dao/oauth.entity';
import { IRole } from '../types/role.types';
import { Role } from '../utils/helper';
import { LocalAuthVO } from '../vo/auth.local.vo';
import { auth } from 'firebase-admin';

export default interface IAuthService {
  /**
   * Registers a new local user (e.g., email/password).
   */
  registerLocalUser(userVo: LocalAuthVO): Promise<ResponseObject>;

  /**
   * Logs in a local user by verifying their credentials.
   * Returns either some success structure (could be a JWT token),
   * or throws an error if invalid credentials.
   */
  loginLocalUser(
    email: string,
    password: string,
  ): Promise<{
    user: LocalAuthEntity;
    accesstoken: string;
    refreshToken: string;
    firebaseToken?: string;
  }>;

  /**
   * Registers a new OAuth user (e.g., social login).
   */
  registerOAuthUser(
    // uid: string,
    provider: string,
    accessToken: string,
    role?: IRole,
  ): Promise<ResponseObject>;

  /**
   * Logs in an OAuth user.
   * In a real app, you'd verify the access token with the provider or
   * check validity in some manner.
   */
  loginOAuthUser(
    provider: string,
    accessToken: string,
  ): Promise<{ user: OAuthEntity; token: string }>;

  // updateLocalAuth(
  //   uid: string,
  //   updateData: AuthUpdateDTO,
  //   currentPassword?: string,
  // ): Promise<ResponseObject>;

  /**
   * Fetches either a Local or OAuth user by their UID, returning null if not found.
   */
  findUserByUID(uid: string): Promise<LocalAuthEntity | OAuthEntity | null>;

  /**
   * Verifies ID token (for OAuth)
   */
  verifyIdToken(token: string): Promise<auth.DecodedIdToken>;

  /**
   * Sets custom claims on a user
   */
  setCustomUserClaims(uid: string, claims: Record<string, any>): Promise<void>;

  /**
   * Creates a custom token for direct Firebase client auth
   */
  createCustomToken(
    uid: string,
    developerClaims?: Record<string, any>,
  ): Promise<string>;

  /**
   * Refreshes token
   */
  refreshToken(refreshToken: string): Promise<{ token: string }>;

  /**
   * Generates an ID token for a user
   */
  generateIdToken(uid: string, claims?: Record<string, any>): Promise<string>;

  getUser(uid: string);

  createUser(properties: auth.CreateRequest): Promise<auth.UserRecord>;

  signOut(uid: string): Promise<void>;
}
