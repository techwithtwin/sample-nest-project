import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  loginFn() {
    const user = this.usersService.getUserById(1);

    return {
      accessToken: 'djkdfjkdjfeivnia',
      user,
    };
  }

  isAuthenticated() {
    return true;
  }
}
