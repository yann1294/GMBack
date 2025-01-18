import { Role, Identification } from "../utils/helper";
import { IUser } from "../utils/user.interface";
import { instanceToPlain } from "class-transformer";
import { FileDTO } from "../controller/dto/helper.dto";
import { Timestamp } from "firebase-admin/firestore";

export class Guide implements IUser {
        public uid: string;
        public firstName: string;
        public lastName: string;
        public phoneNumber: string;
        public emailAddress: string;
        public profilePhoto: string;
        public role: Role;
        public accountStatus: "active" | "inactive";
        public createdAt: Date;
        public updatedAt: Date;
        public identification: Identification;
        public spokenLanguages: string[];
        public availability: boolean;
    
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
            identification: Identification,
            spokenLanguages: string[],
            availability: boolean,
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
            this.identification = identification;
            this.spokenLanguages = spokenLanguages;
            this.availability = availability;
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
            createdAt: this.createdAt ? Timestamp.fromDate(new Date(this.createdAt)) : this.createdAt,
            updatedAt: this.updatedAt ? Timestamp.fromDate(new Date(this.updatedAt)) : this.updatedAt,
            identification: Object.assign({}, this.identification),
            spokenLanguages: this.spokenLanguages,
            availability: this.availability
        };
    }

    toUpdateObject(): object {
        return instanceToPlain(this);
    }

    toDeleteObject(): object {
        return { ...this };
    }
}