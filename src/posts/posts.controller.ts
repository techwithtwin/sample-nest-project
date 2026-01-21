import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetAllPostsQueryDto } from './dtos/get-all-posts-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-posts.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts(@Query() getAllPostsQueryDto: GetAllPostsQueryDto) {
    return this.postsService.getAllPosts(getAllPostsQueryDto);
  }

  @Get('/:id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return createPostDto;
  }
}
