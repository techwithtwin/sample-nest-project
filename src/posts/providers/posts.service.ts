import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedInterface } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Tag } from 'src/tags/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { Post } from '../post.entity';
import { CreatePostProvider } from './create-post.provider';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
    private readonly tagsService: TagsService,
    private readonly createPostProvider: CreatePostProvider,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  // Get All posts
  async getAllPosts(
    postsQuery: GetPostsDto,
  ): Promise<PaginatedInterface<Post>> {
    const results = await this.paginationProvider.paginateQuery(
      {
        limit: postsQuery.limit,
        page: postsQuery.page,
      },
      this.postsRepo,
    );

    return results;
  }

  // Create Post
  async create(createPostDto: CreatePostDto, authorId: number) {
    return this.createPostProvider.createPost(createPostDto, authorId);
  }

  // Get Single post by id
  getPostById(id: number) {
    return {
      id: id,
      title: 'First Post',
    };
  }

  async deletePost(postId: number) {
    await this.postsRepo.delete(postId);

    return { deleted: true, postId };
  }

  // Patch post
  async updatePost(id: number, patchPostDto: PatchPostDto) {
    let tags: Tag[] = [];
    if (patchPostDto.tags) {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);

      if (tags.length !== patchPostDto.tags.length) {
        throw new BadRequestException('1 or more tags does not exist');
      }
    }

    const existingPost = await this.postsRepo.findOneBy({
      id,
    });

    if (!existingPost) throw new NotFoundException('Invalid Post');

    // Update the properties
    existingPost.title = patchPostDto.title ?? existingPost.title;
    existingPost.content = patchPostDto.content ?? existingPost.content;
    existingPost.status = patchPostDto.status ?? existingPost.status;
    existingPost.postType = patchPostDto.postType ?? existingPost.postType;
    existingPost.slug = patchPostDto.slug ?? existingPost.slug;
    existingPost.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? existingPost.featuredImageUrl;
    existingPost.publishedOn =
      patchPostDto.publishedOn ?? existingPost.publishedOn;

    // Assign the new tags
    existingPost.tags = tags;

    // Save
    return await this.postsRepo.save(existingPost);
  }
}
