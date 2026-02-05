import mongoose from 'mongoose';
import { UserRole, ALL_ROLES } from '../../../domain/constants/roles.constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    img: {
      type: String,
    },
    roles: {
      type: [String],
      default: [UserRole.BUYER],
      enum: ALL_ROLES,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
// Note: email index is already created by unique: true
userSchema.index({ roles: 1 });

export const UserModel = mongoose.model('User', userSchema);
