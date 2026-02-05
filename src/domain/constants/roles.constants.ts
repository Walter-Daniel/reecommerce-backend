export enum UserRole {
  // Basic user roles
  GUEST = 'GUEST_ROLE',
  BUYER = 'BUYER_ROLE',
  SELLER = 'SELLER_ROLE',

  // Support roles
  SUPPORT = 'SUPPORT_ROLE',
  MODERATOR = 'MODERATOR_ROLE',

  // Administrative roles
  ADMIN = 'ADMIN_ROLE',
  SUPER_ADMIN = 'SUPER_ADMIN_ROLE',
}

export const ALL_ROLES = Object.values(UserRole);
