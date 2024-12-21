import { Role } from "../vo/helper.vo"
export abstract class IUser {
    public uid: string;
    public firstName: string;
    public lastName: string;
    public password: string;
    public phoneNumber: string;
    public emailAddress: string;
    public profilePhoto: string;
    public role: Role;
    public accountStatus: string;
    public createdAt: Date;
    public updatedAt: Date;

    public abstract toObject(): object;
}