import { Role } from "src/user-management/utils/helper";

export interface IAuth {
  // Shared Fields
  emailAddress?: string;
  role?: Role;
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
