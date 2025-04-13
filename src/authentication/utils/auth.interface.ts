import { Role } from 'src/user-management/utils/helper';
import { IRole } from '../types/role.types';

export interface IAuth {
  // Shared Fields
  uId: string;
  emailAddress?: string;
  role?: IRole;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginDate?: Date;
  failedLoginAttempts?: number;

  // Local Authentication Fields
  password?: string;

  // OAuth Specific Fields
  provider?: string; // e.g., 'google', 'facebook'
  accessToken?: string;
  refreshToken?: string; // Optional: For renewing OAuth tokens
}
