import { BcryptAdapter } from '../../config/bcrypt.js';
import { UserModel } from '../../data/mongodb/models/user.model.js';
import {
  CustomError,
  UserEntity,
  type AuthDatasource,
  type RegisterUserDto,
  type AssignRolesDto,
} from '../../domain/index.js';

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly compareFunction: CompareFunction = BcryptAdapter.compare,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password, roles } = registerUserDto;

    try {
      //1. Verificar si el correo existe
      const emailExist = await UserModel.findOne({ email });
      if (emailExist) throw CustomError.badRequest('User already exist.');

      const user = await UserModel.create({
        name: name,
        email: email,
        password: this.hashPassword(password),
        roles: roles,
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

  async assignRoles(assignRolesDto: AssignRolesDto): Promise<UserEntity> {
    const { userId, roles } = assignRolesDto;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw CustomError.notFound('User not found');
      }

      user.roles = roles;
      await user.save();

      return new UserEntity(
        user.id,
        user.name,
        user.email,
        user.password,
        user.roles,
        user.img
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }
}
