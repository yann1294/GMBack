import { IAuth } from '../utils/auth.interface';
import { LocalAuthEntity } from '../dao/localauth.entity';
import { Role } from '../utils/helper';
import { IRole } from '../types/role.types';

export class LocalAuthVO implements IAuth {
  // Immutable mandatory fields
  private readonly _uId: string;
  private _emailAddress: string;
  private readonly _password: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  // Optional mutable fields

  private _lastLoginDate?: Date;
  private _failedLoginAttempts: number;
  private _role?: IRole;

  constructor(
    uId: string,
    emailAddress: string,
    password: string,
    role?: IRole,
    createdAt?: Date | string,
    updatedAt?: Date | string,
    lastLoginDate?: Date | string,
    failedLoginAttempts?: number,
  ) {
    this._uId = uId;
    this._emailAddress = emailAddress;
    this._password = password;
    this._role = role ? role : { name: 'tourist' };
    this._createdAt =
      typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    this._updatedAt =
      typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
    this._lastLoginDate = lastLoginDate
      ? typeof lastLoginDate === 'string'
        ? new Date(lastLoginDate)
        : lastLoginDate
      : undefined;
    this._failedLoginAttempts = failedLoginAttempts;
  }

  // Getters for mandatory fields
  get uId(): string {
    return this._uId;
  }

  get password(): string {
    return this._password;
  }

  get role(): IRole {
    return this._role;
  }

  set role(value: IRole) {
    this._role = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Getters and setters for optional fields
  get emailAddress(): string | undefined {
    return this._emailAddress;
  }

  set emailAddress(value: string | undefined) {
    this._emailAddress = value;
  }

  get lastLoginDate(): Date | undefined {
    return this._lastLoginDate;
  }

  set lastLoginDate(value: Date | undefined) {
    this._lastLoginDate = value;
  }

  get failedLoginAttempts(): number {
    return this._failedLoginAttempts;
  }

  set failedLoginAttempts(value: number) {
    this._failedLoginAttempts = value;
  }

  // Convert VO to entity
  toEntity(): LocalAuthEntity {
    return new LocalAuthEntity(
      this._uId,
      this._emailAddress!,
      this._password,
      this._role,
      this._createdAt,
      this._updatedAt,
      this._lastLoginDate,
      this._failedLoginAttempts,
    );
  }
}
