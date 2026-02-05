import type { Request, Response } from 'express';
import {
  AuthRepository,
  RegisterUserDto,
  LoginUserDto,
  AssignRolesDto,
  CustomError,
} from '../../domain/index.js';
import { JwtAdapter } from '../../config/jwt.js';

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  registerUser = async (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    try {
      const user = await this.authRepository.register(registerUserDto!);

      // Generate JWT token
      const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
      if (!token) {
        throw CustomError.internalServerError('Error generating token');
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
        token,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  loginUser = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    try {
      const user = await this.authRepository.login(loginUserDto!);

      // Generate JWT token
      const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
      if (!token) {
        throw CustomError.internalServerError('Error generating token');
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
        token,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  getProfile = (req: Request, res: Response) => {
    // User is already attached to req.body by auth middleware
    const user = req.body.user;
    res.json({ user });
  };

  assignRoles = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [error, assignRolesDto] = AssignRolesDto.create({
        userId: id,
        ...req.body,
      });

      if (error) {
        return res.status(400).json({ error });
      }

      const updatedUser = await this.authRepository.assignRoles(
        assignRolesDto!
      );

      res.json({
        message: 'Roles assigned successfully',
        user: updatedUser,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}
