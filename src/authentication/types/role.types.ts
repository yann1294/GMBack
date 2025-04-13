export type RoleName = 'admin' | 'tourist' | 'guide';

export interface IRole {
  name: RoleName;
  permissions?: string[];
  description?: string;
}

// Optional: Default roles configuration
export const AppRoles: Record<string, IRole> = {
  admin: {
    name: 'admin',
    permissions: ['manage:all'],
    description: 'System administrator',
  },
  tourist: {
    name: 'tourist',
    permissions: ['book:tours', 'view:destinations'],
    description: 'Tourism customer',
  },
  guide: {
    name: 'guide',
    permissions: ['manage:tours', 'update:availability'],
    description: 'Tour guide',
  },
};
