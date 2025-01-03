import { Role } from "../utils/helper";
import { IUser } from "../utils/user.interface";
import { instanceToPlain } from "class-transformer";

export class Admin implements IUser {
        public uid: string;
        public firstName: string;
        public lastName: string;
        public phoneNumber: string;
        public emailAddress: string;
        public profilePhoto: string;
        public role: Role;
        public createdAt: Date;
        public updatedAt: Date;
        public accountStatus: "active" | "inactive";
    
        constructor(
            uid: string,
            firstName: string,
            lastName: string,
            phoneNumber: string,
            emailAddress: string,
            profilePhoto: string,
            role: Role,
            createdAt: Date,
            updatedAt: Date,
            accountStatus?: "active" | "inactive"
        ) {
            this.uid = uid;
            this.firstName = firstName;
            this.lastName = lastName;
            this.phoneNumber = phoneNumber;
            this.emailAddress = emailAddress;
            this.profilePhoto = profilePhoto;
            this.role = role;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
            this.accountStatus = accountStatus;
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
            updatedAt: this.updatedAt
        };
    }

    toUpdateObject(): object {
        return instanceToPlain(this);
    }

    toDeleteObject(): object {
        return { ...this };
    }
}