import type { RegisterUserDto } from '../dtos/auth/register-user.dto.js';
import type { AssignRolesDto } from '../dtos/auth/assign-roles.dto.js';
import type { UserEntity } from '../entities/user.entity.js';

export abstract class AuthDatasource {
  // abstract login(loginUserDto: LoginUserDto)

  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;

  abstract assignRoles(assignRolesDto: AssignRolesDto): Promise<UserEntity>;
}
