import {
  CustomError,
  UserEntity,
  type AuthDatasource,
  type RegisterUserDto,
} from '../../domain/index.js';

export class AuthDatasourceImpl implements AuthDatasource {
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;

    try {
      //1. Verificar si el correo existe
      if ('test@email.com' === email) {
        throw CustomError.badRequest('Correo ya existe');
      }
      //2. Hash de contraseña
      //3. Mapear la respuesta a nuestra entidad
      return new UserEntity('1', name, email, password, ['ADMIN_ROLE']);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }
}
