export class Role {
    constructor(private readonly _name: string, private readonly _permissions: string[] = []) {}
  
    get name(): string {
      return this._name;
    }
  
    get permissions(): string[] {
      return this._permissions;
    }
  
    hasPermission(permission: string): boolean {
      return this._permissions.includes(permission);
    }
  
    toString(): string {
      return this._name;
    }
  }
  