import {
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';

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
    // Config Service
    private readonly configService: ConfigService,
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
}
