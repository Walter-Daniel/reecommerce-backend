import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain/index.js';
import { JwtAdapter } from '../../config/jwt.js';
import { UserModel } from '../../data/mongodb/models/user.model.js';

export class AuthMiddleware {
  /**
   * Validates JWT token and attaches user to request
   */
  static async validateJWT(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Extract token from Authorization header
      const authorization = req.header('Authorization');
      if (!authorization) {
        throw CustomError.unauthorized('No token provided');
      }

      if (!authorization.startsWith('Bearer ')) {
        throw CustomError.unauthorized('Invalid token format');
      }

      const token = authorization.replace('Bearer ', '');

      // Validate JWT token and extract user payload
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) {
        throw CustomError.unauthorized('Invalid token');
      }

      // Get user from database
      const user = await UserModel.findById(payload.id);
      if (!user) {
        throw CustomError.unauthorized('User not found');
      }

      // Attach user to request
      req.body.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      };

      next();
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
