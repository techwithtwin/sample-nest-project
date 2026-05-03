import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async createGoogleUser(googleUser: GoogleUser) {
    try {
      const user = this.usersRepo.create(googleUser);
      return await this.usersRepo.save(user);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could Not Create A New User!',
      });
    }
  }
}
