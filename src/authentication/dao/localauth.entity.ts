import { instanceToPlain } from 'class-transformer';
import { IAuth } from '../utils/auth.interface';
import { Role } from 'src/user-management/utils/helper';
import { IRole } from '../types/role.types';

export class LocalAuthEntity implements IAuth {
  public uId: string;
  public emailAddress: string;
  public password: string;
  public role: IRole;
  public createdAt: Date;
  public updatedAt: Date;
  public lastLoginDate?: Date;
  public failedLoginAttempts: number;
  public authType: string = 'local';

  constructor(
    uId: string,
    emailAddress: string,
    password: string,
    role: IRole,
    createdAt: Date,
    updatedAt: Date,
    lastLoginDate?: Date,
    failedLoginAttempts?: number,
  ) {
    this.uId = uId;
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
      uid: this.uId,
      emailAddress: this.emailAddress,
      role: this.role ? { ...this.role } : { name: 'tourist', permissions: [] },
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
