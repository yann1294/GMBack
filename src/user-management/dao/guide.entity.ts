import { Identification, Role } from "../vo/helper.vo";
import { User } from "../utils/user.abstract";
import { instanceToPlain } from "class-transformer";
import { FileDTO } from "../controller/dto/helper.dto";

export class Guide extends User {
    public identification: Identification;
    public spokenLanguages: string[];
    public availability: boolean;

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
        updatedAt: string,
        identification: Identification,
        spokenLanguages: string[],
        availability: boolean
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
        this.identification = identification;
        this.spokenLanguages = spokenLanguages;
        this.availability = availability;
    }

    toObject(): object {
        return {
            uid: this.uid,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            emailAddress: this.emailAddress,
            profilePhoto: this.profilePhoto,
            role: Object.assign({}, this.role),
            accountStatus: this.accountStatus,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
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
