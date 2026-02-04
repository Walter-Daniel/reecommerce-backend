export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public roles: string[],
    public image?: string,
  ) {}

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.roles.includes(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.roles.includes(role));
  }
}
