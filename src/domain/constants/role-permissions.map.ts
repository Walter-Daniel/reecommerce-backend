import { UserRole } from './roles.constants.js';
import { Permission } from './permissions.constants.js';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [Permission.READ_PRODUCT],

  [UserRole.BUYER]: [
    Permission.READ_PRODUCT,
    Permission.CREATE_ORDER,
    Permission.READ_ORDER,
    Permission.CANCEL_ORDER,
    Permission.CREATE_REVIEW,
    Permission.READ_USER,
  ],

  [UserRole.SELLER]: [
    // Everything a buyer can do
    Permission.READ_PRODUCT,
    Permission.CREATE_ORDER,
    Permission.READ_ORDER,
    Permission.CANCEL_ORDER,
    Permission.CREATE_REVIEW,
    Permission.READ_USER,

    // Plus seller capabilities
    Permission.CREATE_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.VIEW_SALES_REPORTS,
  ],

  [UserRole.PREMIUM_SELLER]: [
    // Everything a seller can do
    Permission.READ_PRODUCT,
    Permission.CREATE_ORDER,
    Permission.READ_ORDER,
    Permission.CANCEL_ORDER,
    Permission.CREATE_REVIEW,
    Permission.READ_USER,
    Permission.CREATE_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.VIEW_SALES_REPORTS,

    // Plus premium features
    Permission.VIEW_FINANCIAL_REPORTS,
  ],

  [UserRole.SUPPORT]: [
    Permission.READ_PRODUCT,
    Permission.READ_ORDER,
    Permission.READ_ALL_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.READ_USER,
    Permission.READ_ALL_USERS,
    Permission.REFUND_ORDER,
  ],

  [UserRole.MODERATOR]: [
    Permission.READ_PRODUCT,
    Permission.APPROVE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.MODERATE_REVIEW,
    Permission.DELETE_REVIEW,
    Permission.MODERATE_CONTENT,
    Permission.READ_USER,
    Permission.READ_ALL_USERS,
    Permission.BAN_USER,
  ],

  [UserRole.ADMIN]: [
    Permission.READ_PRODUCT,
    Permission.APPROVE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.READ_ORDER,
    Permission.READ_ALL_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.REFUND_ORDER,
    Permission.READ_USER,
    Permission.READ_ALL_USERS,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.ASSIGN_ROLES,
    Permission.MODERATE_REVIEW,
    Permission.DELETE_REVIEW,
    Permission.MODERATE_CONTENT,
    Permission.BAN_USER,
    Permission.VIEW_SALES_REPORTS,
    Permission.VIEW_USER_REPORTS,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_LOGS,
  ],

  [UserRole.SUPER_ADMIN]: [
    // All permissions
    ...Object.values(Permission),
  ],
};
