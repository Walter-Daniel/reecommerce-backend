import type { Request, Response } from 'express';
import {
  AuthRepository,
  RegisterUserDto,
  AssignRolesDto,
  CustomError,
} from '../../domain/index.js';

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authRepository
      .register(registerUserDto!)
      .then((user) => res.json(user))
      .catch((error) => {
        if (error instanceof CustomError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      });
  };

  loginUser = (req: Request, res: Response) => {
    res.json('Login user controller');
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
