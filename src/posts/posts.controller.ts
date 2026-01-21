import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetAllPostsQueryDto } from './dtos/get-all-posts-query.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

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

  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 response when your post is created successfully.',
  })
  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return createPostDto;
  }

  @ApiOperation({
    summary: "Update a blog post by it's Id",
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 response when your post is update successfully.',
  })
  @Patch('/:id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchPostDto: PatchPostDto,
  ) {
    console.log(id);
    console.log(patchPostDto);
  }
}
