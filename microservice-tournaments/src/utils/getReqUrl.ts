import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// a custom decorator that return URL of the server (we use it to serve images)
// you can use it like @Body() or @Request()
// just put @GetReqUrl() in your controller
export const GetReqUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const url = request.protocol + '://' + request.get('host');
    return url;
  },
);
