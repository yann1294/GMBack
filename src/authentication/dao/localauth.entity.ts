import { instanceToPlain } from "class-transformer";
import { IAuth } from "../utils/auth.interface";
import { Role } from "src/user-management/utils/helper";

export class LocalAuthEntity implements IAuth {
  public uid: string;
  public emailAddress: string;
  public password: string;
  public role: Role;
  public createdAt: Date;
  public updatedAt: Date;
  public lastLoginDate?: Date;
  public failedLoginAttempts: number;
  public authType: string = "local";

  constructor(
    uid: string,
    emailAddress: string,
    password: string,
    role: Role,
    createdAt: Date,
    updatedAt: Date,
    lastLoginDate?: Date,
    failedLoginAttempts?: number,
  ) {
    this.uid = uid;
    this.emailAddress = emailAddress;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoginDate = lastLoginDate;
    this.failedLoginAttempts = failedLoginAttempts || 0;
  }

  toObject(): object {
    return {
      uid: this.uid,
      emailAddress: this.emailAddress,
      role: this.role ? Object.assign({}, this.role) : undefined,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginDate: this.lastLoginDate,
      failedLoginAttempts: this.failedLoginAttempts,
      authType: this.authType,
      password: this.password,
    };
  }

  toUpdateObject(): object {
    return instanceToPlain(this);
  }

  toDeleteObject(): object {
    return { ...this };
  }
}
