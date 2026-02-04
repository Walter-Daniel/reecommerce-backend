import { Validators } from '../../../config/validators.js';
import type { ValidationError } from '../../errors/validation.error.js';

export class LoginUserDto {
  private constructor(
    public email: string,
    public password: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [ValidationError | undefined, LoginUserDto?] {
    if (!object) return [{ field: 'body', message: 'Request body is empty' }];

    const { email, password } = object;

    if (!email) return [{ field: 'email', message: 'Missing email' }];
    if (!Validators.email.test(email))
      return [{ field: 'email', message: 'Email is not valid' }];
    if (!password) {
      return [{ field: 'password', message: 'Password is required' }];
    }

    return [undefined, new LoginUserDto(email.toLowerCase(), password)];
  }
}
