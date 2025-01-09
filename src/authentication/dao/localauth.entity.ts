import { Role } from "../utils/helper";
import { instanceToPlain } from "class-transformer";
import { IAuth } from "../utils/auth.interface";

export class LocalAuthEntity implements IAuth {
  public uid: string;
  public userName: string;
  public emailAddress: string;
  public password: string;
  public role: Role;
  public createdAt: Date;
  public updatedAt: Date;
  public lastLoginDate?: Date;
  public failedLoginAttempts: number;

  constructor(
    uid: string,
    userName: string,
    emailAddress: string,
    password: string,
    role: Role,
    createdAt: Date,
    updatedAt: Date,
    lastLoginDate?: Date,
    failedLoginAttempts?: number,
  ) {
    this.uid = uid;
    this.userName = userName;
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
      userName: this.userName,
      emailAddress: this.emailAddress,
      role: this.role ? Object.assign({}, this.role) : undefined,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginDate: this.lastLoginDate,
      failedLoginAttempts: this.failedLoginAttempts,
    };
  }

  toUpdateObject(): object {
    return instanceToPlain(this);
  }

  toDeleteObject(): object {
    return { ...this };
  }
}
