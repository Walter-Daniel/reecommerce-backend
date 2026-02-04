import { ALL_ROLES } from '../../constants/roles.constants.js';

export interface ValidationError {
  field: string;
  message: string;
}

export class AssignRolesDto {
  private constructor(
    public userId: string,
    public roles: string[]
  ) {}

  static create(object: {
    [key: string]: any;
  }): [ValidationError | undefined, AssignRolesDto?] {
    const { userId, roles } = object;

    if (!userId) {
      return [{ field: 'userId', message: 'User ID is required' }];
    }

    if (!roles || !Array.isArray(roles)) {
      return [{ field: 'roles', message: 'Roles must be an array' }];
    }

    if (roles.length === 0) {
      return [{ field: 'roles', message: 'At least one role is required' }];
    }

    // Validate all roles are valid
    const invalidRoles = roles.filter((role) => !ALL_ROLES.includes(role));
    if (invalidRoles.length > 0) {
      return [
        {
          field: 'roles',
          message: `Invalid roles: ${invalidRoles.join(', ')}`,
        },
      ];
    }

    return [undefined, new AssignRolesDto(userId, roles)];
  }
}
