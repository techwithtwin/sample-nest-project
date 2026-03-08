import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';
import { AuthTypeEnum } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthTypeEnum.Bearer;

  private readonly authTypeGuardMap: Record<
    AuthTypeEnum,
    CanActivate | CanActivate[]
  >;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthTypeEnum.Bearer]: this.accessTokenGuard,
      [AuthTypeEnum.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes: AuthTypeEnum[] = this.reflector.getAllAndOverride<
      AuthTypeEnum[]
    >(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]) ?? [
      AuthenticationGuard.defaultAuthType,
    ];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    // Default Error
    let error: Error = new UnauthorizedException();

    // Loop guards calling each canActivate
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err as Error;
      });

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
