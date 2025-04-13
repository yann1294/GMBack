// current-user.decorator.ts
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { Validate } from 'class-validator';
import { RoleParamDto } from 'src/authentication/controller/dto/auth.roleparam.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
export const RoleParam = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const roleParam = request.params.role;

    // Create a temporary object to validate
    const roleObj = { name: roleParam };
    const errors = Validate(RoleParamDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid role parameter');
    }

    return roleObj;
  },
);
