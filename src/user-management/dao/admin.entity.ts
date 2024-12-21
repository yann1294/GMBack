import { Role } from "../vo/helper.vo";
import { User } from "../utitls/user.abstract";

export class Admin extends User {
    constructor(
        uid: string,
        firstName: string,
        lastName: string,
        password: string,
        phoneNumber: string,
        emailAddress: string,
        profilePhoto: string,
        role: Role,
        accountStatus: string,
        createdAt: string,
        updatedAt: string
    ) {
        super();
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
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
}
