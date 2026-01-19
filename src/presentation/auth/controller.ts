import type { Request, Response } from 'express';
import { RegisterUserDto } from '../../domain/index.js';

export class AuthController {
  constructor() {}

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });
    res.json(registerUserDto);
  };

  loginUser = (req: Request, res: Response) => {
    res.json('Login user controller');
  };
}
