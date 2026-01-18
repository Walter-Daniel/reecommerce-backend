import type { Request, Response } from 'express';

export class AuthController {
  constructor() {}

  registerUser = (req: Request, res: Response) => {
    res.json('Register user controller');
  };

  loginUser = (req: Request, res: Response) => {
    res.json('Login user controller');
  };
}
