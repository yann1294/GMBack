import { Role } from "../vo/helper.vo";

export const userRoles: { tourist: Role, guide: Role, admin: Role } = {
    tourist: { name: "tourist" } as Role,
    guide: { name: "guide" } as Role,
    admin: { name: "admin" } as Role,
}