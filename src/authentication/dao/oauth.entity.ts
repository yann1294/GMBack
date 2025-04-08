import { instanceToPlain } from "class-transformer";
import { IAuth } from "../utils/auth.interface";
import { Role } from "src/user-management/utils/helper";

export class OAuthEntity implements IAuth {
  public uid: string;
  public emailAddress: string;
  public provider: string;
  public accessToken: string;
  public refreshToken?: string;
  public role?: Role;
  public createdAt?: Date;
  public updatedAt?: Date;
  public lastLoginDate?: Date;
  public authType: string = "oauth";

  constructor(
    uid: string,
    emailAddress: string,
    provider: string,
    accessToken: string,
    refreshToken?: string,
    role?: Role,
    createdAt?: Date,
    updatedAt?: Date,
    lastLoginDate?: Date,
  ) {
    this.uid = uid;
    this.emailAddress = emailAddress;
    this.provider = provider;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoginDate = lastLoginDate;
  }

  toObject(): object {
    return {
      uid: this.uid,
      emailAddress: this.emailAddress,
      provider: this.provider,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      role: this.role ? Object.assign({}, this.role) : undefined,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginDate: this.lastLoginDate,
      authType: this.authType,
    };
  }

  toUpdateObject(): object {
    return instanceToPlain(this);
  }

  toDeleteObject(): object {
    return { ...this };
  }
}
