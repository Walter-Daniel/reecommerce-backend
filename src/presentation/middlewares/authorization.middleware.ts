import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain/index.js';
import { PermissionService } from '../../domain/services/permission.service.js';
import type { Permission } from '../../domain/constants/permissions.constants.js';

export class AuthorizationMiddleware {
  /**
   * Validates that authenticated user has required role(s)
   * @param allowedRoles - Array of roles that can access this route
   */
  static validateRoles(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // Get user from request (attached by auth middleware)
        const user = req.body.user;

        if (!user) {
          throw CustomError.unauthorized('User not authenticated');
        }

        // Check if user has any of the allowed roles
        const hasRole = allowedRoles.some((role) => user.roles.includes(role));

        if (!hasRole) {
          throw CustomError.forbidden(
            `Requires one of these roles: ${allowedRoles.join(', ')}`
          );
        }

        next();
      } catch (error) {
        if (error instanceof CustomError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      }
    };
  }

  /**
   * Validates that authenticated user has required permission(s)
   * @param requiredPermissions - Array of permissions required
   * @param requireAll - If true, user must have ALL permissions (AND). If false, ANY permission (OR)
   */
  static validatePermissions(
    requiredPermissions: Permission[],
    requireAll: boolean = false
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // Get user from request (attached by auth middleware)
        const user = req.body.user;

        if (!user) {
          throw CustomError.unauthorized('User not authenticated');
        }

        const hasPermission = requireAll
          ? PermissionService.hasAllPermissions(
              user.roles,
              requiredPermissions
            )
          : PermissionService.hasAnyPermission(user.roles, requiredPermissions);

        if (!hasPermission) {
          throw CustomError.forbidden(
            `Requires ${requireAll ? 'all' : 'one'} of these permissions: ${requiredPermissions.join(', ')}`
          );
        }

        next();
      } catch (error) {
        if (error instanceof CustomError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      }
    };
  }

  /**
   * Validates that user has a specific single permission
   * Convenience method for common use case
   */
  static requirePermission(permission: Permission) {
    return this.validatePermissions([permission], false);
  }
}
