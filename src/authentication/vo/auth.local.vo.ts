import { IAuth } from '../utils/auth.interface';
import { LocalAuthEntity } from '../dao/localauth.entity';
import { IRole } from '../types/role.types';

export class LocalAuthVO implements IAuth {
  // Immutable mandatory fields
  private readonly _uId: string;
  private _emailAddress: string;
  private readonly _password: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private _firstName?: string;
  private _lastName?: string;
  private _phoneNumber?: string;
  private _profilePhoto?: string;
  private _identificationFile?: string;
  private _identificationType?: string;
  private _spokenLanguages?: string[];
  private _availability?: boolean;
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
    authType?: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    profilePhoto?: string,
    identificationFile?: string,
    identificationType?: string,
    spokenLanguages?: string[],
    availability?: boolean,
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
    this._firstName = firstName;
    this._lastName = lastName;
    this._phoneNumber = phoneNumber;
    this._profilePhoto = profilePhoto;
    this._identificationFile = identificationFile;
    this._identificationType = identificationType;
    this._spokenLanguages = spokenLanguages;
    this._availability = availability;
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
  get emailAddress(): string {
    return this._emailAddress;
  }

  set emailAddress(value: string) {
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

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  get profilePhoto(): string {
    return this._profilePhoto;
  }

  set profilePhoto(value: string) {
    this._profilePhoto = value;
  }

  get identificationFile(): string {
    return this._identificationFile;
  }

  set identificationFile(value: string) {
    this._identificationFile = value;
  }

  get identificationType(): string {
    return this._identificationType;
  }

  set identificationType(value: string) {
    this._identificationType = value;
  }

  get spokenLanguages(): string[] {
    return this._spokenLanguages;
  }

  set spokenLanguages(value: string[]) {
    this._spokenLanguages = value;
  }

  get availability(): boolean {
    return this._availability;
  }

  set availability(value: boolean) {
    this._availability = value;
  }

  // Convert VO to entity
  toEntity(tokens?: {
    accessToken: string;
    refreshToken: string;
    firebaseToken?: string;
  }): LocalAuthEntity {
    return new LocalAuthEntity(
      this._uId,
      this._emailAddress!,
      this._password,
      this._role,
      this._createdAt,
      this._updatedAt,
      this._lastLoginDate!,
      this._failedLoginAttempts,
      tokens,
      {
        firstName: this._firstName,
        lastName: this._lastName,
        phoneNumber: this._phoneNumber,
        profilePhoto: this._profilePhoto,
        identificationFile: this._identificationFile,
        identificationType: this._identificationType,
        spokenLanguages: this._spokenLanguages,
        availability: this._availability,
      },
    );
  }
}
