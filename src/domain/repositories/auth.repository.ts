import type { RegisterUserDto } from '../dtos/auth/register-user.dto.js';
import type { UserEntity } from '../entities/user.entity.js';

export abstract class AuthRepository {
  // abstract login(loginUserDto: LoginUserDto)

  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
