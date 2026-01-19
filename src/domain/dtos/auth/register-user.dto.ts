import { Validators } from '../../../config/validators.js';
import type { ValidationError } from '../../errors/validation-error.js';

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  static create(object: {
    [key: string]: any;
  }): [ValidationError | undefined, RegisterUserDto?] {
    if (!object) return [{ field: 'body', message: 'Request body is empty' }];

    const { name, email, password } = object;
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

    return [
      undefined,
      new RegisterUserDto(name, email.toLowerCase(), password),
    ];
  }
}
