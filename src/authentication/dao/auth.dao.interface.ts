import { LocalAuthEntity } from './localauth.entity';
import { ResponseObject } from '../../shared/types';
import { OAuthEntity } from './oauth.entity';
import { Role } from '../utils/helper';

export default interface IAuthDAO {
  // Create
  createLocalAuth(authEntity: LocalAuthEntity): Promise<ResponseObject>;
  createOAuthAuth(authEntity: OAuthEntity): Promise<ResponseObject>;

  // Read (Local)
  findLocalAuthByUID(uid: string): Promise<LocalAuthEntity | null>;
  findLocalAuthByUserName(userName: string): Promise<LocalAuthEntity | null>;

  // Read (OAuth)
  findOAuthByUID(uid: string): Promise<OAuthEntity | null>;
  findOAuthByEmail(emailAddress: string): Promise<OAuthEntity | null>;

  // Update
  updateLocalAuth(authEntity: LocalAuthEntity): Promise<ResponseObject>;
  updateOAuthAuth(authEntity: OAuthEntity): Promise<ResponseObject>;

  // Delete (shared, by UID)
  deleteAuth(uid: string): Promise<ResponseObject>;

  // Find any auth doc (local or oauth) with a given role
  findAuthByRole(role: Role): Promise<Array<LocalAuthEntity | OAuthEntity>>;
}
