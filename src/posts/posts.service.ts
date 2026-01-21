import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { GetAllPostsQueryDto } from './dtos/get-all-posts-query.dto';

@Injectable()
export class PostsService {
  /*
   *Injecting Users Service
   */
  constructor(private readonly usersService: UsersService) {}

  // Get All posts
  getAllPosts({ userId }: GetAllPostsQueryDto) {
    if (userId) {
      const user = this.usersService.getUserById(userId);

      return [
        {
          id: 1,
          title: 'First Post',
          content: 'Test Content',
          user: user,
        },
      ];
    }
    return [
      {
        id: 1,
        title: 'First Post',
        content: 'Test content',
      },
      {
        id: 1,
        title: 'Second Post',
        content: 'Test Content',
      },
    ];
  }

  // Get Single post by id
  getPostById(id: number) {
    return {
      id: id,
      title: 'First Post',
    };
  }
}
