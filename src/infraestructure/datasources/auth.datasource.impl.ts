import { BcryptAdapter } from '../../config/bcrypt.js';
import { UserModel } from '../../data/mongodb/models/user.model.js';
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
      const emailExist = await UserModel.findOne({ email });
      if (emailExist) throw CustomError.badRequest('User already exist.');

      const user = await UserModel.create({
        name: name,
        email: email,
        password: BcryptAdapter.hash(password),
      });
      //2. Hash de contraseña
      await user.save();
      //3. Mapear la respuesta a nuestra entidad
      return new UserEntity(user.id, name, email, user.password, user.roles);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }
}
