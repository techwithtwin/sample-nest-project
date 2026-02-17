import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { CreateUserProvider } from './create-user.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    // Auth service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    // User repo
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    // users createmany provider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    // inject create user provider
    private readonly createUserProvider: CreateUserProvider,

    // find one user by email
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * Get all users from the database and also return the results, based on the limit and page number
   */
  getAllUsers(limit: number, page: number) {
    console.log('Limit', limit, 'page', page);

    return this.usersRepository.find();
  }

  //Get single user
  async getUserById(userId: number) {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  // create many users
  async createMany(createUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createUsersDto);
  }

  // find user by email
  async findUserByEmail(email: string) {
    return await this.findUserByEmailProvider.findUserByEmail(email);
  }
}
