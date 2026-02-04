import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain/index.js';

export class AuthMiddleware {
  /**
   * Validates JWT token and attaches user to request
   * TODO: Implement JWT validation when auth is complete
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

      // TODO: Validate JWT token and extract user payload
      // const payload = await JWTAdapter.validateToken(token);
      // const user = await UserModel.findById(payload.id);

      // For now, this is a placeholder
      // Once JWT is implemented, attach user to request:
      // req.body.user = user;

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
