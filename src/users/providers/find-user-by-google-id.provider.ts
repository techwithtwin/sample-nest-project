import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindUserByGoogleIdProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findUserByGoogleId(googleId: string) {
    return await this.usersRepo.findOneBy({
      googleId,
    });
  }
}
