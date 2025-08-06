import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { users } from '@prisma/client';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log(data);
    const request = ctx.switchToHttp().getRequest<{ user: users }>();
    return request.user;
  },
);
