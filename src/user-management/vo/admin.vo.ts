import { IUser } from "../utils/user.interface";
import { Role, Identification } from "../utils/helper";
import { Admin } from "../dao/admin.entity";
import { FileDTO } from "../controller/dto/helper.dto";

export class AdminVO implements IUser {
  // Critical fields are mandatory and immutable
  private readonly _uid: string;
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private readonly _role: Role; // Aggregation

  // Optional fields remain optional and mutable if necessary
  private _phoneNumber?: string;
  private _emailAddress?: string;
  private _profilePhoto?: string | FileDTO;

  constructor(
    uid: string,
    firstName: string,
    lastName: string,
    role: Role,
    createdAt: Date | string,
    updatedAt: Date | string,
    // Optional fields
    phoneNumber?: string,
    emailAddress?: string,
    profilePhoto?: string | FileDTO
  ) {
    // Mandatory fields are validated and set as readonly properties
    this._uid = uid;
    this._firstName = firstName;
    this._lastName = lastName;
    this._role = role;
    this._createdAt = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
    this._updatedAt = typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;

    // Optional fields
    this._phoneNumber = phoneNumber;
    this._emailAddress = emailAddress;
    this._profilePhoto = profilePhoto;
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

  set profilePhoto(value: string | undefined) {
    this._profilePhoto = value;
  }

  // Method to transform GuideVO into an entity
  toEntity(): Admin {
    return new Admin(
      this._uid,
      this._firstName,
      this._lastName,
      this._phoneNumber,
      this._emailAddress,
      this._profilePhoto as string,
      this._role,
      this._createdAt,
      this._updatedAt
    );
  }
}
