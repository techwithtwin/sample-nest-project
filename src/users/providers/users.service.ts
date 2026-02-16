import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

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
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser)
      throw new ConflictException('User with this email already exists!');

    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
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
}
