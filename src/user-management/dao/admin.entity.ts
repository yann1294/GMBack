import { Role } from "../vo/helper.vo";
import { User } from "../utils/user.abstract";
import { instanceToPlain } from "class-transformer";
import { FileDTO } from "../controller/dto/helper.dto";

export class Admin extends User {
    constructor(
        uid: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        emailAddress: string,
        profilePhoto: string | FileDTO,
        role: Role,
        accountStatus: string,
        createdAt: string,
        updatedAt: string
    ) {
        super();
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.emailAddress = emailAddress;
        this.profilePhoto = profilePhoto;
        this.role = role;
        this.accountStatus = accountStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toObject(): object {
        return {
            uid: this.uid,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            emailAddress: this.emailAddress,
            role: Object.assign({}, this.role),
            accountStatus: this.accountStatus,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    toUpdateObject(): object {
        return instanceToPlain(this);
      }
    
      toDeleteObject(): object {
        return { ...this };
      }
}
