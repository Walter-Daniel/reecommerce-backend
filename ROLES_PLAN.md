# Plan: Sistema de Gestión de Roles y Permisos (Estilo Mercado Libre)

## Resumen Ejecutivo

Implementar un sistema completo de roles y permisos granulares para la aplicación Node.js e-commerce, similar a Mercado Libre, con soporte para múltiples roles simultáneos y permisos específicos por recurso.

**Características principales:**
- ✅ Múltiples roles simultáneos por usuario
- ✅ Permisos granulares por recurso (crear:producto, ver:reportes, etc.)
- ✅ Middleware de autorización para proteger rutas
- ✅ Sistema intermedio: Roles + permisos específicos
- ✅ Integración con arquitectura limpia existente

---

## Roles del Sistema (E-Commerce)

```typescript
GUEST              // Visitante sin autenticar
BUYER_ROLE         // Comprador (default)
SELLER_ROLE        // Vendedor
SUPPORT_ROLE       // Soporte al cliente
MODERATOR_ROLE     // Moderador de contenido
ADMIN_ROLE         // Administrador
SUPER_ADMIN_ROLE   // Super administrador
```

---

## Permisos Granulares

**Productos:**
- `create:product`, `read:product`, `update:product`, `delete:product`, `approve:product`

**Órdenes/Ventas:**
- `create:order`, `read:order`, `read:all_orders`, `update:order_status`, `cancel:order`, `refund:order`

**Usuarios:**
- `read:user`, `read:all_users`, `update:user`, `delete:user`, `assign:roles`

**Reportes:**
- `view:sales_reports`, `view:user_reports`, `view:financial_reports`

**Sistema:**
- `moderate:content`, `ban:user`, `manage:settings`, `view:logs`

---

## Estructura de Implementación

### Fase 1: Constantes y Configuración

**Archivos a crear:**

1. **src/domain/constants/roles.constants.ts**
   - Enum `UserRole` con todos los roles
   - Array `ALL_ROLES` para validaciones

2. **src/domain/constants/permissions.constants.ts**
   - Enum `Permission` con todos los permisos granulares

3. **src/domain/constants/role-permissions.map.ts**
   - Mapeo `ROLE_PERMISSIONS: Record<UserRole, Permission[]>`
   - Define qué permisos tiene cada rol

### Fase 2: Servicios de Dominio

**Archivos a crear:**

4. **src/domain/services/permission.service.ts**
   - `getPermissionsForRoles(roles: string[]): Permission[]` - Obtiene todos los permisos de un conjunto de roles
   - `hasPermission(roles: string[], permission: Permission): boolean` - Verifica un permiso específico
   - `hasAnyPermission(roles: string[], permissions: Permission[]): boolean` - Lógica OR
   - `hasAllPermissions(roles: string[], permissions: Permission[]): boolean` - Lógica AND

### Fase 3: Actualizar Entidades y Modelos

**Archivos a modificar:**

5. **src/domain/entities/user.entity.ts**
   - Renombrar campo `role` a `roles` para consistencia
   - Agregar métodos helper:
     - `hasRole(role: string): boolean`
     - `hasAnyRole(roles: string[]): boolean`
     - `hasAllRoles(roles: string[]): boolean`

6. **src/data/mongodb/models/user.model.ts**
   - Actualizar enum de roles con los nuevos valores
   - Cambiar default de `['USER_ROLE']` a `['BUYER_ROLE']`
   - Agregar índice en campo `roles` para performance
   - Agregar timestamps (createdAt, updatedAt)

### Fase 4: Middleware de Autorización

**Archivos a crear:**

7. **src/presentation/middlewares/auth.middleware.ts**
   - `validateJWT(req, res, next)` - Valida token JWT y adjunta usuario al request
   - **NOTA:** Implementación placeholder hasta que se implemente JWT

8. **src/presentation/middlewares/authorization.middleware.ts**
   - `validateRoles(allowedRoles: string[])` - Middleware para validar roles
   - `validatePermissions(requiredPermissions: Permission[], requireAll?: boolean)` - Middleware para validar permisos
   - `requirePermission(permission: Permission)` - Atajo para validar un solo permiso

9. **src/presentation/middlewares/index.ts**
   - Barrel export de todos los middlewares

### Fase 5: DTOs para Gestión de Roles

**Archivos a crear/modificar:**

10. **src/domain/dtos/auth/assign-roles.dto.ts** (NUEVO)
    - DTO para asignar roles a usuarios
    - Validación de userId y array de roles
    - Validación de roles válidos

11. **src/domain/dtos/auth/register-user.dto.ts** (MODIFICAR)
    - Agregar campo opcional `roles: string[]`
    - Default a `['BUYER_ROLE']`
    - Validar roles contra `ALL_ROLES`

### Fase 6: Actualizar Capa de Dominio

**Archivos a modificar:**

12. **src/domain/datasources/auth.datasource.ts**
    - Agregar método abstracto `assignRoles(assignRolesDto: AssignRolesDto): Promise<UserEntity>`

13. **src/domain/repositories/auth.repository.ts**
    - Agregar método abstracto `assignRoles(assignRolesDto: AssignRolesDto): Promise<UserEntity>`

14. **src/domain/errors/custom.errors.ts**
    - Verificar que exista método `forbidden(message: string)`
    - Agregar si no existe

15. **src/domain/index.ts**
    - Exportar nuevos DTOs, constantes, y servicios

### Fase 7: Implementar en Capa de Infraestructura

**Archivos a modificar:**

16. **src/infraestructure/datasources/auth.datasource.impl.ts**
    - Implementar método `assignRoles(assignRolesDto: AssignRolesDto)`
    - Buscar usuario por ID
    - Actualizar campo `roles`
    - Retornar UserEntity actualizado

17. **src/infraestructure/repositories/auth.repository.impl.ts**
    - Implementar método `assignRoles(assignRolesDto: AssignRolesDto)`
    - Delegar llamada al datasource

### Fase 8: Actualizar Controladores y Rutas

**Archivos a modificar:**

18. **src/presentation/auth/controller.ts**
    - Agregar método `getProfile(req, res)` - Retorna perfil del usuario autenticado
    - Agregar método `assignRoles(req, res)` - Asigna roles a un usuario (admin only)
    - Actualizar manejo de errores en `registerUser`

19. **src/presentation/auth/routes.ts**
    - Importar middlewares de autorización
    - Agregar ruta `GET /profile` (requiere autenticación)
    - Agregar ruta `POST /users/:id/roles` (requiere permiso `assign:roles`)

### Fase 9: Ejemplos de Uso en Rutas

**Archivos de ejemplo a crear (opcional):**

20. **src/presentation/products/routes.ts** (EJEMPLO)
    - Rutas públicas: `GET /` y `GET /:id`
    - Rutas protegidas por permiso:
      - `POST /` - Requiere `create:product`
      - `PUT /:id` - Requiere `update:product`
      - `DELETE /:id` - Requiere `delete:product`
      - `POST /:id/approve` - Requiere rol ADMIN o MODERATOR

21. **src/presentation/orders/routes.ts** (EJEMPLO)
    - `POST /` - Requiere `create:order`
    - `GET /my-orders` - Requiere `read:order`
    - `GET /all` - Requiere `read:all_orders`
    - `POST /:id/refund` - Requiere `read:order` AND `refund:order`

---

## Archivos Críticos (Orden de Implementación)

1. `src/domain/constants/roles.constants.ts` - Base del sistema
2. `src/domain/constants/permissions.constants.ts` - Definición de permisos
3. `src/domain/constants/role-permissions.map.ts` - Mapeo roles-permisos
4. `src/domain/services/permission.service.ts` - Lógica de verificación
5. `src/data/mongodb/models/user.model.ts` - Actualizar modelo DB
6. `src/domain/entities/user.entity.ts` - Actualizar entidad
7. `src/presentation/middlewares/authorization.middleware.ts` - Protección de rutas
8. `src/domain/dtos/auth/assign-roles.dto.ts` - Gestión de roles

---

## Patrón de Uso en Rutas

### Ejemplo 1: Validar Rol

```typescript
router.post(
  '/products',
  AuthMiddleware.validateJWT,
  AuthorizationMiddleware.validateRoles([UserRole.SELLER, UserRole.ADMIN]),
  controller.createProduct
);
```

### Ejemplo 2: Validar Permiso Único

```typescript
router.post(
  '/products',
  AuthMiddleware.validateJWT,
  AuthorizationMiddleware.requirePermission(Permission.CREATE_PRODUCT),
  controller.createProduct
);
```

### Ejemplo 3: Validar Múltiples Permisos (OR)

```typescript
router.get(
  '/reports',
  AuthMiddleware.validateJWT,
  AuthorizationMiddleware.validatePermissions(
    [Permission.VIEW_SALES_REPORTS, Permission.VIEW_USER_REPORTS],
    false // requireAll = false (OR logic)
  ),
  controller.getReports
);
```

### Ejemplo 4: Validar Múltiples Permisos (AND)

```typescript
router.post(
  '/orders/:id/refund',
  AuthMiddleware.validateJWT,
  AuthorizationMiddleware.validatePermissions(
    [Permission.READ_ORDER, Permission.REFUND_ORDER],
    true // requireAll = true (AND logic)
  ),
  controller.refundOrder
);
```

---

## Verificación End-to-End

### 1. Preparación
```bash
# Iniciar MongoDB
docker-compose up -d

# Instalar dependencias (si hay nuevas)
npm install

# Iniciar aplicación
npm run dev
```

### 2. Registrar Usuarios de Prueba

**Comprador (default):**
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Juan Comprador",
  "email": "buyer@test.com",
  "password": "pass1234"
}
```

**Vendedor:**
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "María Vendedora",
  "email": "seller@test.com",
  "password": "pass1234",
  "roles": ["SELLER_ROLE"]
}
```

**Admin:**
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "pass1234",
  "roles": ["ADMIN_ROLE"]
}
```

### 3. Verificar en MongoDB

```bash
# Conectar a MongoDB
docker exec -it <container_id> mongosh -u mongo-user -p 123456

# Usar base de datos
use mystore

# Ver usuarios creados
db.users.find().pretty()

# Verificar que los roles se guardaron correctamente
db.users.find({}, { name: 1, email: 1, roles: 1 })
```

### 4. Probar Asignación de Roles (Cuando JWT esté implementado)

```http
POST http://localhost:3000/api/auth/users/USER_ID/roles
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "roles": ["BUYER_ROLE", "SELLER_ROLE"]
}
```

### 5. Probar Middleware de Autorización

Crear rutas de prueba protegidas y verificar:
- ✅ Usuario con permiso correcto puede acceder
- ✅ Usuario sin permiso recibe error 403
- ✅ Usuario sin autenticación recibe error 401
- ✅ Usuarios con múltiples roles acumulan permisos

### 6. Verificar PermissionService

Probar en consola Node:
```javascript
import { PermissionService } from './src/domain/services/permission.service.js';
import { UserRole } from './src/domain/constants/roles.constants.js';
import { Permission } from './src/domain/constants/permissions.constants.js';

// Ver permisos de un BUYER
const buyerPerms = PermissionService.getPermissionsForRoles([UserRole.BUYER]);
console.log('BUYER permissions:', buyerPerms);

// Ver permisos de BUYER + SELLER
const multiPerms = PermissionService.getPermissionsForRoles([
  UserRole.BUYER,
  UserRole.SELLER
]);
console.log('BUYER+SELLER permissions:', multiPerms);

// Verificar permiso específico
const canCreate = PermissionService.hasPermission(
  [UserRole.SELLER],
  Permission.CREATE_PRODUCT
);
console.log('SELLER can create product:', canCreate);
```

---

## Notas Importantes

### Sobre JWT
- El sistema de roles está listo pero requiere implementar JWT para funcionar completamente
- `AuthMiddleware.validateJWT` es un placeholder que debe implementarse
- Una vez implementado JWT, el usuario autenticado se adjunta a `req.body.user`

### Sobre Migración de Datos
- Usuarios existentes con `['USER_ROLE']` deben migrarse a `['BUYER_ROLE']`
- Script de migración sugerido:
```javascript
db.users.updateMany(
  { roles: ['USER_ROLE'] },
  { $set: { roles: ['BUYER_ROLE'] } }
)
```

### Sobre Extensibilidad
- Agregar nuevos permisos: Editar `permissions.constants.ts`
- Agregar nuevos roles: Editar `roles.constants.ts` y `role-permissions.map.ts`
- Los cambios en constantes no requieren migración de DB (código-based)

### Sobre Performance
- Permisos se calculan en memoria (no consultas DB)
- Índice en campo `roles` mejora queries
- Cache de permisos puede agregarse si hay problemas de performance

---

## Ventajas del Diseño

1. **Sigue Arquitectura Limpia:** Respeta la separación en capas existente
2. **Type-Safe:** TypeScript previene errores en compile-time
3. **Escalable:** Fácil agregar roles y permisos sin cambiar estructura
4. **Flexible:** Soporta validación por roles O por permisos granulares
5. **Sin Overhead DB:** Permisos en código (más rápido, más simple)
6. **Testeable:** Cada capa se puede probar independientemente
7. **Múltiples Roles:** Usuario puede ser BUYER + SELLER simultáneamente

---

## Extensiones Futuras (Fuera de Scope)

- [ ] Ownership de recursos (usuario solo edita SUS productos)
- [ ] Permisos dinámicos en base de datos
- [ ] Cache de permisos por usuario
- [ ] Audit log de accesos
- [ ] Jerarquía de roles con herencia
- [ ] Rate limiting por rol
- [ ] Permisos temporales (premium por 30 días)
