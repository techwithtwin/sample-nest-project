import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST_USER_KEY } from '../auth.constants';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];

    if (!user) {
      throw new UnauthorizedException(
        'CurrentUser used without authentication',
      );
    }

    return field ? user[field] : user;
  },
);
