import { instanceToPlain } from 'class-transformer';
import { IAuth } from '../utils/auth.interface';
import { Role } from '../utils/helper';
import { IRole } from '../types/role.types';

export class OAuthEntity implements IAuth {
  public uId: string;
  public emailAddress: string;
  public provider: string;
  public tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  public role?: IRole;
  public createdAt?: Date;
  public updatedAt?: Date;
  public lastLoginDate?: Date;
  public authType: string = 'oauth';

  constructor(
    uId: string,
    emailAddress: string,
    provider: string,
    tokens?: {
      accessToken: string;
      refreshToken: string;
    },
    role?: IRole,
    createdAt?: Date,
    updatedAt?: Date,
    lastLoginDate?: Date,
  ) {
    this.uId = uId;
    this.emailAddress = emailAddress;
    this.provider = provider;
    this.tokens = tokens;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoginDate = lastLoginDate;
  }

  toObject(): object {
    return {
      uid: this.uId,
      emailAddress: this.emailAddress,
      provider: this.provider,
      tokens: this.tokens,
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
