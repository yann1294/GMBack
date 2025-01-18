import { IUser } from "../utils/user.interface";
import { Role, Identification } from "../utils/helper";
import { Guide } from "../dao/guide.entity";
import { FileDTO } from "../controller/dto/helper.dto";

export class GuideVO implements IUser {
  // Critical fields are mandatory and immutable
  private readonly _uid: string;
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private readonly _role: Role; // Aggregation
  private readonly _identification: Identification; // Composition

  // Optional fields remain optional and mutable if necessary
  private _phoneNumber?: string;
  private _emailAddress?: string;
  private _profilePhoto?: string | FileDTO;
  private _accountStatus?: "active" | "inactive";
  private _spokenLanguages?: string[];
  private _availability?: boolean;

  constructor(
    uid: string,
    firstName: string,
    lastName: string,
    role: Role,
    createdAt: Date | string,
    updatedAt: Date | string,
    idFile: string | FileDTO,
    idType: string,
    // Optional fields
    phoneNumber?: string,
    emailAddress?: string,
    profilePhoto?: string | FileDTO,
    accountStatus?: "active" | "inactive",
    spokenLanguages?: string[],
    availability?: boolean
  ) {
    // Mandatory fields are validated and set as readonly properties
    this._uid = uid;
    this._firstName = firstName;
    this._lastName = lastName;
    this._role = role;
    this._createdAt = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
    this._updatedAt = typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;

    // Composition: Identification is created and owned by this class
    this._identification = new Identification(idFile, idType);

    // Optional fields
    this._phoneNumber = phoneNumber;
    this._emailAddress = emailAddress;
    this._profilePhoto = profilePhoto;
    this._accountStatus = accountStatus;
    this._spokenLanguages = spokenLanguages;
    this._availability = availability;
  }

  // Getters for immutable fields
  get uid(): string {
    return this._uid;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get role(): Role {
    return this._role;
  }

  get identification(): Identification {
    return this._identification;
  }

  // Optional fields have standard getters and setters
  get phoneNumber(): string | undefined {
    return this._phoneNumber;
  }

  set phoneNumber(value: string | undefined) {
    this._phoneNumber = value;
  }

  get emailAddress(): string | undefined {
    return this._emailAddress;
  }

  set emailAddress(value: string | undefined) {
    this._emailAddress = value;
  }

  get profilePhoto(): string | FileDTO | undefined {
    return this._profilePhoto;
  }

  set profilePhoto(value: string | FileDTO | undefined) {
    this._profilePhoto = value;
  }

  get accountStatus(): "active" | "inactive" | undefined {
    return this._accountStatus;
  }

  set accountStatus(value: "active" | "inactive" | undefined) {
    this._accountStatus = value;
  }

  get spokenLanguages(): string[] | undefined {
    return this._spokenLanguages;
  }

  set spokenLanguages(value: string[] | undefined) {
    this._spokenLanguages = value;
  }

  get availability(): boolean | undefined {
    return this._availability;
  }

  set availability(value: boolean | undefined) {
    this._availability = value;
  }

  // Method to update identification details
  setIdentificationDetails(idFile: string | FileDTO, idType: string): void {
    this._identification.type = idType;
    this._identification.file = idFile;
  }

  // Method to transform GuideVO into an entity
  toEntity(): Guide {
    return new Guide(
      this._uid,
      this._firstName,
      this._lastName,
      this._phoneNumber,
      this._emailAddress,
      this._profilePhoto as string,
      this._role,
      this._createdAt,
      this._updatedAt,
      this._identification,
      this._spokenLanguages,
      this._availability,
      this._accountStatus
    );
  }
}
