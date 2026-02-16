import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { User } from '../user.entity';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    // Inject Datasource
    private readonly dataSource: DataSource,
  ) {}

  // Create many users
  async createMany(createUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    // Create a query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();
    // Connect Query Runner to datasource
    await queryRunner.connect();
    // Start transaction
    await queryRunner.startTransaction();

    try {
      for (const user of createUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(User, newUser);
        newUsers.push(result);
      }

      // if successfull commit
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      // rollback
      await queryRunner.rollbackTransaction();

      throw new RequestTimeoutException(
        'Unable to create users at the moment.',
      );
    } finally {
      // release connection
      await queryRunner.release();
    }

    return newUsers;
  }
}
