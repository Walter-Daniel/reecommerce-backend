import type {
  AuthDatasource,
  AuthRepository,
  RegisterUserDto,
  AssignRolesDto,
  UserEntity,
} from '../../domain/index.js';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authDatasource: AuthDatasource) {}

  register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.authDatasource.register(registerUserDto);
  }

  assignRoles(assignRolesDto: AssignRolesDto): Promise<UserEntity> {
    return this.authDatasource.assignRoles(assignRolesDto);
  }
}