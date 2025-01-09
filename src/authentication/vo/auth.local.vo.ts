import { IAuth } from "../utils/auth.interface";
import { Role } from "../utils/helper";
import { LocalAuthEntity } from "../dao/localauth.entity";

export class LocalAuthVO implements IAuth {
  // Immutable mandatory fields
  private readonly _uid: string;
  private readonly _userName: string;
  private readonly _password: string;
  private readonly _role: Role;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  // Optional mutable fields
  private _emailAddress?: string;
  private _lastLoginDate?: Date;
  private _failedLoginAttempts: number;

  constructor(
    uid: string,
    userName: string,
    password: string,
    role: Role,
    createdAt: Date | string,
    updatedAt: Date | string,
    emailAddress?: string,
    lastLoginDate?: Date | string,
    failedLoginAttempts: number = 0,
  ) {
    this._uid = uid;
    this._userName = userName;
    this._password = password;
    this._role = role;
    this._createdAt = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
    this._updatedAt = typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;
    this._emailAddress = emailAddress;
    this._lastLoginDate = lastLoginDate
      ? typeof lastLoginDate === "string"
        ? new Date(lastLoginDate)
        : lastLoginDate
      : undefined;
    this._failedLoginAttempts = failedLoginAttempts;
  }

  // Getters for mandatory fields
  get uid(): string {
    return this._uid;
  }

  get userName(): string {
    return this._userName;
  }

  get password(): string {
    return this._password;
  }

  get role(): Role {
    return this._role;
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
      this._uid,
      this._userName,
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
