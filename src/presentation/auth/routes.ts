import { Router } from 'express';
import { AuthController } from './controller.js';
import {
  AuthDatasourceImpl,
  AuthRepositoryImpl,
} from '../../infraestructure/index.js';
import {
  AuthMiddleware,
  AuthorizationMiddleware,
} from '../middlewares/index.js';
import { Permission } from '../../domain/constants/permissions.constants.js';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const datasource = new AuthDatasourceImpl();
    const authRepository = new AuthRepositoryImpl(datasource);

    const controller = new AuthController(authRepository);

    //Definir todas las rutas principales

    // Public routes
    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);

    // Protected routes - require authentication
    router.get('/profile', AuthMiddleware.validateJWT, controller.getProfile);

    // Admin only - assign roles to users
    router.post(
      '/users/:id/roles',
      AuthMiddleware.validateJWT,
      AuthorizationMiddleware.requirePermission(Permission.ASSIGN_ROLES),
      controller.assignRoles
    );

    return router;
  }
}
