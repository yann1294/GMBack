import { PartialType } from "@nestjs/mapped-types";
import { User } from "../utitls/user.abstract";
import { Admin } from "../dao/admin.entity";

export class AdminVO extends User {
    toEntity(): Admin {
        return new Admin(
            this.uid,
            this.firstName,
            this.lastName,
            this.password,
            this.phoneNumber,
            this.emailAddress,
            this.profilePhoto,
            this.role,
            this.accountStatus,
            this.createdAt,
            this.updatedAt
          );
    }
}