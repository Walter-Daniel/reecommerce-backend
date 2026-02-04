import { Validators } from '../../../config/validators.js';
import type { ValidationError } from '../../errors/validation.error.js';
import { UserRole, ALL_ROLES } from '../../constants/roles.constants.js';

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public roles: string[] = [UserRole.BUYER]
  ) {}

  static create(object: {
    [key: string]: any;
  }): [ValidationError | undefined, RegisterUserDto?] {
    if (!object) return [{ field: 'body', message: 'Request body is empty' }];

    const { name, email, password, roles } = object;
    if (!name) return [{ field: 'name', message: 'Missing name' }];
    if (!email) return [{ field: 'email', message: 'Missing email' }];
    if (!Validators.email.test(email))
      return [{ field: 'email', message: 'Email is not valid' }];
    if (!password) {
      return [{ field: 'password', message: 'Password is required' }];
    }
    if (password.length < 4 || password.length > 9)
      return [
        {
          field: 'password',
          message: 'Password must be between 6 and 9 characters long',
        },
      ];

    // Validate roles if provided
    let validatedRoles = [UserRole.BUYER]; // Default
    if (roles && Array.isArray(roles)) {
      const invalidRoles = roles.filter(
        (role: string) => !ALL_ROLES.includes(role)
      );
      if (invalidRoles.length > 0) {
        return [
          {
            field: 'roles',
            message: `Invalid roles: ${invalidRoles.join(', ')}`,
          },
        ];
      }
      validatedRoles = roles;
    }

    return [
      undefined,
      new RegisterUserDto(name, email.toLowerCase(), password, validatedRoles),
    ];
  }
}
