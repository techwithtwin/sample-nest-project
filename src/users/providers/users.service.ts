import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  // Get All Users
  getAllUsers(limit: number, page: number) {
    console.log('limit: ', limit, 'page: ', page);
    if (!this.authService.isAuthenticated()) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return [
      {
        fullname: 'Boniface maina',
      },
      {
        fullname: 'John Doe',
      },
      {
        fullname: 'Stephen Mwai',
      },
    ];
  }

  //Get single user
  getUserById(userId: number) {
    return {
      id: userId,
      name: 'John Doe',
      lastLogin: Date.now(),
    };
  }
}
