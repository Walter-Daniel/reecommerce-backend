import { Permission } from '../constants/permissions.constants.js';
import { UserRole } from '../constants/roles.constants.js';
import { ROLE_PERMISSIONS } from '../constants/role-permissions.map.js';

export class PermissionService {
  /**
   * Get all permissions for given roles
   */
  static getPermissionsForRoles(roles: string[]): Permission[] {
    const permissionsSet = new Set<Permission>();

    for (const role of roles) {
      const rolePermissions = ROLE_PERMISSIONS[role as UserRole] || [];
      rolePermissions.forEach((permission) => permissionsSet.add(permission));
    }

    return Array.from(permissionsSet);
  }

  /**
   * Check if roles have a specific permission
   */
  static hasPermission(roles: string[], permission: Permission): boolean {
    const permissions = this.getPermissionsForRoles(roles);
    return permissions.includes(permission);
  }

  /**
   * Check if roles have any of the specified permissions (OR logic)
   */
  static hasAnyPermission(
    roles: string[],
    permissions: Permission[]
  ): boolean {
    const userPermissions = this.getPermissionsForRoles(roles);
    return permissions.some((permission) =>
      userPermissions.includes(permission)
    );
  }

  /**
   * Check if roles have all of the specified permissions (AND logic)
   */
  static hasAllPermissions(
    roles: string[],
    permissions: Permission[]
  ): boolean {
    const userPermissions = this.getPermissionsForRoles(roles);
    return permissions.every((permission) =>
      userPermissions.includes(permission)
    );
  }
}
