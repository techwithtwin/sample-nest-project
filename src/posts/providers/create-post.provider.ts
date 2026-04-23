import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/tags.service';
import { Tag } from 'src/tags/tag.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreatePostProvider {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
    private readonly tagsService: TagsService,
  ) {}

  async createPost(createPostDto: CreatePostDto, authorId: number) {
    let tags: Tag[] = [];

    if (createPostDto.tags) {
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    }

    if (createPostDto.tags?.length !== tags.length) {
      throw new BadRequestException('Tags Supplied exceeds, tags found!');
    }

    const newPost = this.postsRepo.create({
      ...createPostDto,
      tags,
      author: {
        id: authorId,
      },
    });

    return await this.postsRepo.save(newPost);
  }
}
