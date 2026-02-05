# Node.js E-Commerce API

API REST de autenticación y autorización para aplicaciones de e-commerce, construida con Node.js, Express, TypeScript y MongoDB. Implementa un sistema completo de roles y permisos granulares inspirado en Mercado Libre.

## 🚀 Características

- ✅ **Autenticación JWT completa** - Login y registro con tokens seguros
- ✅ **Sistema de roles y permisos granulares** - 7 roles con más de 30 permisos específicos
- ✅ **Múltiples roles simultáneos** - Los usuarios pueden tener varios roles a la vez
- ✅ **Arquitectura limpia** - Separación en capas (Domain, Infrastructure, Presentation, Data)
- ✅ **Validación robusta** - DTOs con validación de datos usando Joi
- ✅ **Seguridad** - Contraseñas hasheadas con bcryptjs
- ✅ **TypeScript** - Type-safe en toda la aplicación
- ✅ **MongoDB** - Base de datos NoSQL con Mongoose

## 📋 Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| `GUEST_ROLE` | Visitante sin autenticar - solo lectura de productos |
| `BUYER_ROLE` | Comprador - puede realizar compras y crear reseñas |
| `SELLER_ROLE` | Vendedor - puede gestionar productos y ver reportes de ventas |
| `SUPPORT_ROLE` | Soporte al cliente - puede gestionar órdenes y usuarios |
| `MODERATOR_ROLE` | Moderador - puede aprobar productos y moderar contenido |
| `ADMIN_ROLE` | Administrador - acceso completo excepto sistema crítico |
| `SUPER_ADMIN_ROLE` | Super administrador - acceso total al sistema |

## 🔑 Permisos por Categoría

### Productos
- `create:product`, `read:product`, `update:product`, `delete:product`, `approve:product`

### Órdenes/Ventas
- `create:order`, `read:order`, `read:all_orders`, `update:order_status`, `cancel:order`, `refund:order`

### Usuarios
- `read:user`, `read:all_users`, `update:user`, `delete:user`, `assign:roles`

### Reportes
- `view:sales_reports`, `view:user_reports`, `view:financial_reports`

### Sistema
- `moderate:content`, `ban:user`, `manage:settings`, `view:logs`

## 🛠️ Tecnologías

- **Node.js** v18+
- **TypeScript** v5.9.3
- **Express** v5.2.1
- **MongoDB** v6.0.6
- **Mongoose** v9.1.5
- **JWT** (jsonwebtoken)
- **bcryptjs** v3.0.3
- **Joi** v18.0.2

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- Docker (para MongoDB)
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd nodeapp
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:

```env
PORT=3000
MONGO_URL=mongodb://mongo-user:123456@localhost:27017
MONGO_DB_NAME=mystore
JWT_SECRET=your-secret-key-change-this-in-production-min-32-chars
```

> ⚠️ **Importante**: Cambiar `JWT_SECRET` a una clave segura de al menos 32 caracteres en producción.

4. **Iniciar MongoDB con Docker**
```bash
docker-compose up -d
```

5. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

6. **Build para producción**
```bash
npm run build
npm start
```

## 🌐 API Endpoints

### Autenticación (Públicos)

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "roles": ["SELLER_ROLE"]  // opcional, default: ["BUYER_ROLE"]
}
```

**Respuesta exitosa:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "roles": ["SELLER_ROLE"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "roles": ["SELLER_ROLE"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Endpoints Protegidos

#### Obtener Perfil
```http
GET /api/auth/profile
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "roles": ["SELLER_ROLE"]
  }
}
```

#### Asignar Roles (Solo ADMIN)
```http
POST /api/auth/users/:id/roles
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
  "roles": ["BUYER_ROLE", "SELLER_ROLE"]
}
```

**Respuesta:**
```json
{
  "message": "Roles assigned successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "roles": ["BUYER_ROLE", "SELLER_ROLE"]
  }
}
```

## 🔒 Uso de Middlewares

### Validar Autenticación
```typescript
import { AuthMiddleware } from './presentation/middlewares';

router.get('/protected',
  AuthMiddleware.validateJWT,
  controller.method
);
```

### Validar Roles
```typescript
import { AuthorizationMiddleware } from './presentation/middlewares';
import { UserRole } from './domain/constants/roles.constants';

router.post('/admin-only',
  AuthMiddleware.validateJWT,
  AuthorizationMiddleware.validateRoles([UserRole.ADMIN]),
  controller.method
);
```

### Validar Permisos
```typescript
import { AuthorizationMiddleware } from './presentation/middlewares';
import { Permission } from './domain/constants/permissions.constants';

router.post('/products',
  AuthMiddleware.validateJWT,
  AuthorizationMiddleware.requirePermission(Permission.CREATE_PRODUCT),
  controller.createProduct
);
```

### Validar Múltiples Permisos (AND/OR)
```typescript
// Requiere TODOS los permisos (AND)
router.post('/refund',
  AuthMiddleware.validateJWT,
  AuthorizationMiddleware.validatePermissions(
    [Permission.READ_ORDER, Permission.REFUND_ORDER],
    true  // requireAll = true
  ),
  controller.refundOrder
);

// Requiere AL MENOS UN permiso (OR)
router.get('/reports',
  AuthMiddleware.validateJWT,
  AuthorizationMiddleware.validatePermissions(
    [Permission.VIEW_SALES_REPORTS, Permission.VIEW_USER_REPORTS],
    false  // requireAll = false
  ),
  controller.getReports
);
```

## 📁 Estructura del Proyecto

```
nodeapp/
├── src/
│   ├── config/               # Configuración y adaptadores
│   │   ├── bcrypt.ts        # Adaptador bcrypt para passwords
│   │   ├── jwt.ts           # Adaptador JWT para tokens
│   │   ├── envs.ts          # Validación de variables de entorno
│   │   └── validators.ts    # Validadores (email, etc.)
│   │
│   ├── data/                # Capa de datos
│   │   └── mongodb/
│   │       └── models/      # Modelos de Mongoose
│   │           └── user.model.ts
│   │
│   ├── domain/              # Capa de dominio (lógica de negocio)
│   │   ├── constants/       # Roles, permisos, mapeos
│   │   ├── datasources/     # Interfaces de datasources
│   │   ├── dtos/           # Data Transfer Objects
│   │   ├── entities/       # Entidades de dominio
│   │   ├── errors/         # Manejo de errores
│   │   ├── repositories/   # Interfaces de repositorios
│   │   └── services/       # Servicios de dominio
│   │
│   ├── infrastructure/      # Implementaciones
│   │   ├── datasources/    # Implementación de datasources
│   │   └── repositories/   # Implementación de repositorios
│   │
│   ├── presentation/        # Capa de presentación
│   │   ├── middlewares/    # Middlewares de autenticación/autorización
│   │   ├── auth/           # Controladores y rutas de auth
│   │   ├── routes.ts       # Agregador de rutas
│   │   └── server.ts       # Configuración de Express
│   │
│   └── app.ts              # Punto de entrada
│
├── .env                     # Variables de entorno (no en git)
├── docker-compose.yml       # Configuración de MongoDB
├── package.json
├── tsconfig.json
├── ROLES_PLAN.md           # Planificación detallada del sistema
└── README.md
```

## 🏗️ Arquitectura

El proyecto sigue el patrón de **Clean Architecture** (Arquitectura Limpia):

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Controllers, Routes, Middlewares)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Infrastructure Layer             │
│  (Repository & Datasource Implementations)│
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Domain Layer                   │
│   (Entities, DTOs, Interfaces, Rules)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           Data Layer                    │
│        (MongoDB Models)                 │
└─────────────────────────────────────────┘
```

### Ventajas de esta arquitectura:

- ✅ **Independencia de frameworks** - El dominio no depende de Express o Mongoose
- ✅ **Testeable** - Cada capa se puede testear independientemente
- ✅ **Mantenible** - Cambios en una capa no afectan las demás
- ✅ **Escalable** - Fácil agregar nuevas funcionalidades

## 🧪 Testing

Para ejecutar tests (cuando estén implementados):

```bash
npm test
```

## 🔐 Seguridad

- **Contraseñas hasheadas** con bcryptjs (10 rounds)
- **JWT tokens** con expiración de 2 horas
- **Validación de entrada** en todos los DTOs
- **Variables de entorno** para datos sensibles
- **Custom errors** con códigos HTTP apropiados

## 📝 Scripts Disponibles

```bash
npm run dev        # Ejecutar en modo desarrollo con tsx
npm run build      # Compilar TypeScript a JavaScript
npm start          # Build + ejecutar en producción
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Autores

- Desarrollador Principal
- Co-Authored-By: Claude Sonnet 4.5

## 📚 Documentación Adicional

- [ROLES_PLAN.md](ROLES_PLAN.md) - Planificación detallada del sistema de roles y permisos
- Arquitectura de Clean Architecture
- Patrones de diseño utilizados: Repository, DTO, Adapter, Dependency Injection

---

**Nota**: Este es un sistema en desarrollo activo. Consulta el archivo ROLES_PLAN.md para la documentación completa del sistema de roles y permisos.
