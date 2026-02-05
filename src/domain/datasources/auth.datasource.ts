import type { RegisterUserDto } from '../dtos/auth/register-user.dto.js';
import type { LoginUserDto } from '../dtos/auth/login-user.dto.js';
import type { AssignRolesDto } from '../dtos/auth/assign-roles.dto.js';
import type { UserEntity } from '../entities/user.entity.js';

export abstract class AuthDatasource {
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;

  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;

  abstract assignRoles(assignRolesDto: AssignRolesDto): Promise<UserEntity>;
}
