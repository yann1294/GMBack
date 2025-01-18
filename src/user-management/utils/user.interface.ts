import { FileDTO } from "../controller/dto/helper.dto";
import { Role } from "../utils/helper";

export interface IUser {
  uid?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  profilePhoto?: string | FileDTO;
  role: Role;
  accountStatus?: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
