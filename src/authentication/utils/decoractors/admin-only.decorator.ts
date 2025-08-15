// src/auth/decorators/admin-only.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../firebase-auth.guard';
import { AdminGuard } from '../guards/admin.guard';

export const AdminOnly = () =>
  applyDecorators(UseGuards(FirebaseAuthGuard, AdminGuard));
