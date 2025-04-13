import { IAuth } from '../utils/auth.interface';
// import { Role } from "../utils/helper";
import { OAuthEntity } from '../dao/oauth.entity';
import { Role } from '../utils/helper';
import { IRole } from '../types/role.types';

export class OAuthVO implements IAuth {
  // Immutable mandatory fields
  private readonly _uId: string;
  private readonly _provider: string;
  private readonly _accessToken: string;

  // Optional mutable fields
  private _emailAddress?: string;
  private _refreshToken?: string;
  private _role?: IRole;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _lastLoginDate?: Date;

  constructor(
    uId: string,
    provider: string,
    accessToken: string,
    emailAddress?: string,
    refreshToken?: string,
    role?: IRole,
    createdAt?: Date | string,
    updatedAt?: Date | string,
    lastLoginDate?: Date | string,
  ) {
    this._uId = uId;
    this._provider = provider;
    this._accessToken = accessToken;
    this._emailAddress = emailAddress;
    this._refreshToken = refreshToken;
    this._role = role;
    this._createdAt = createdAt
      ? typeof createdAt === 'string'
        ? new Date(createdAt)
        : createdAt
      : undefined;
    this._updatedAt = updatedAt
      ? typeof updatedAt === 'string'
        ? new Date(updatedAt)
        : updatedAt
      : undefined;
    this._lastLoginDate = lastLoginDate
      ? typeof lastLoginDate === 'string'
        ? new Date(lastLoginDate)
        : lastLoginDate
      : undefined;
  }

  // Getters for mandatory fields
  get uId(): string {
    return this._uId;
  }

  get provider(): string {
    return this._provider;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  // Getters and setters for optional fields
  get emailAddress(): string | undefined {
    return this._emailAddress;
  }

  set emailAddress(value: string | undefined) {
    this._emailAddress = value;
  }

  get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  set refreshToken(value: string | undefined) {
    this._refreshToken = value;
  }

  get role(): IRole | undefined {
    return this._role;
  }

  set role(value: IRole | undefined) {
    this._role = value;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  set createdAt(value: Date | undefined) {
    this._createdAt = value;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  set updatedAt(value: Date | undefined) {
    this._updatedAt = value;
  }

  get lastLoginDate(): Date | undefined {
    return this._lastLoginDate;
  }

  set lastLoginDate(value: Date | undefined) {
    this._lastLoginDate = value;
  }

  // Convert VO to entity
  toEntity(): OAuthEntity {
    return new OAuthEntity(
      this._uId,
      this._emailAddress!,
      this._provider,
      this._accessToken,
      this._refreshToken,
      this._role,
      this._createdAt,
      this._updatedAt,
      this._lastLoginDate,
    );
  }
}
