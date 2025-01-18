import { Role } from "./helper";

export interface IAuth {
  // Shared Fields
  userName?: string;
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
