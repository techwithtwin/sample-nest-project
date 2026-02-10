import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { Post } from './post.entity';
import { TagsService } from 'src/tags/tags.service';
import { Tag } from 'src/tags/tag.entity';
import { PatchPostDto } from './dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  // Get All posts
  getAllPosts() {
    return this.postsRepo.find({
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });
  }

  // Create Post
  async create(createPostDto: CreatePostDto) {
    // Find author from database
    const author = await this.usersService.getUserById(createPostDto.authorId);

    if (!author) throw new UnauthorizedException();

    // find tags
    let tags: Tag[] = [];
    if (createPostDto.tags) {
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    }

    const newPost = this.postsRepo.create({
      ...createPostDto,
      author: author,
      tags,
    });

    return await this.postsRepo.save(newPost);
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
