import { ResponseObject } from '../../shared/types';
import { LocalAuthEntity } from '../dao/localauth.entity';
import { OAuthEntity } from '../dao/oauth.entity';
import { Role } from '../utils/helper';
import { LocalAuthVO } from '../vo/auth.local.vo';

export default interface IAuthService {
  /**
   * Registers a new local user (e.g., email/password).
   */
  registerLocalUser(
    userVo: LocalAuthVO
  ): Promise<ResponseObject>;

  /**
   * Logs in a local user by verifying their credentials.
   * Returns either some success structure (could be a JWT token),
   * or throws an error if invalid credentials.
   */
  loginLocalUser(
    email: string,
    password: string,
  ): Promise<{ user: LocalAuthEntity; token: string }>;

  /**
   * Registers a new OAuth user (e.g., social login).
   */
  registerOAuthUser(
    // uid: string,
    email: string,
    provider: string,
    accessToken: string,
    role?: Role,
  ): Promise<ResponseObject>;

  /**
   * Logs in an OAuth user.
   * In a real app, you'd verify the access token with the provider or
   * check validity in some manner.
   */
  loginOAuthUser(
    provider: string,
    uid: string,
  ): Promise<{ user: OAuthEntity; token: string }>;

  /**
   * Fetches either a Local or OAuth user by their UID, returning null if not found.
   */
  findUserByUID(uid: string): Promise<LocalAuthEntity | OAuthEntity | null>;
}
