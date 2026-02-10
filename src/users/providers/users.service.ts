import {
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { ConfigService } from '@nestjs/config';

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

    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    return newUser;
  }

  /**
   * Get all users from the database and also return the results, based on the limit and page number
   */
  async getAllUsers(limit: number, page: number) {
    const dbHost = this.configService.get<string>('DB_HOST');

    console.log('DBHOST', dbHost);

    if (!this.authService.isAuthenticated()) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.usersRepository.find();
  }

  //Get single user
  async getUserById(userId: number) {
    return await this.usersRepository.findOneBy({
      id: userId,
    });
  }
}
