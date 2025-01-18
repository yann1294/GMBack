import { Exclude, Expose, Transform } from "class-transformer";
import { UserDTO } from "./helper.dto";
import { Role } from "src/user-management/utils/helper";


export class GuideResponseDTO extends UserDTO {
  @Expose()
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Optionally exclude sensitive or unnecessary fields for the response
  @Exclude()
  public uid: string;

  @Exclude()
  public phoneNumber: string;

  @Exclude()
  public emailAddress: string;

  @Exclude()
  public role: Role;
}
