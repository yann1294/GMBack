import { Expose } from "class-transformer";
import { UserDTO } from "./helper.dto";


export class AdminResponseDTO extends UserDTO {
  @Expose()
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  public numberOfGuides: number; // Derived field for the number of guides managed

  @Expose()
  public numberOfTourists: number; // Derived field for the number of tourists managed

  @Expose()
  public adminRole: string; // Specific role or privileges (e.g., "super-admin")

  @Expose()
  public lastLogin: Date; // Optional field for tracking last login timestamp
}
/*
  Derived Fields: Ensure fields like numberOfGuides and numberOfTourists are calculated at the service
   layer before mapping to AdminResponseDTO.
   Flexibility: This approach allows for easy customization if admin-specific response fields expand
   in the future.
*/
