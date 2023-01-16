import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// a custom decorator that return user email
// you can use it like @Body() or @Request()
// just put @UserEmail() in your controller
export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.email;
  },
);
