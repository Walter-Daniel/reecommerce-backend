export enum Permission {
  // Product permissions
  CREATE_PRODUCT = 'create:product',
  READ_PRODUCT = 'read:product',
  UPDATE_PRODUCT = 'update:product',
  DELETE_PRODUCT = 'delete:product',
  APPROVE_PRODUCT = 'approve:product',

  // Order/Sale permissions
  CREATE_ORDER = 'create:order',
  READ_ORDER = 'read:order',
  READ_ALL_ORDERS = 'read:all_orders',
  UPDATE_ORDER_STATUS = 'update:order_status',
  CANCEL_ORDER = 'cancel:order',
  REFUND_ORDER = 'refund:order',

  // User management permissions
  READ_USER = 'read:user',
  READ_ALL_USERS = 'read:all_users',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',
  ASSIGN_ROLES = 'assign:roles',

  // Review permissions
  CREATE_REVIEW = 'create:review',
  DELETE_REVIEW = 'delete:review',
  MODERATE_REVIEW = 'moderate:review',

  // Report permissions
  VIEW_SALES_REPORTS = 'view:sales_reports',
  VIEW_USER_REPORTS = 'view:user_reports',
  VIEW_FINANCIAL_REPORTS = 'view:financial_reports',

  // Content moderation
  MODERATE_CONTENT = 'moderate:content',
  BAN_USER = 'ban:user',

  // System permissions
  MANAGE_SETTINGS = 'manage:settings',
  VIEW_LOGS = 'view:logs',
}
