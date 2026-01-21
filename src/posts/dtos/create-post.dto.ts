import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';

enum PostEnum {
  POST = 'post',
  PAGE = 'page',
  STORY = 'story',
  SERIES = 'series',
}

enum StatusEnum {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  REVIEW = 'review',
  PUBLISHED = 'published',
}

export class CreatePostDto {
  @ApiProperty({
    example: 'This is a title',
    description: 'This is the title for the blog post.',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: PostEnum,
    description: "Possible values, 'post','page', 'story', 'series",
  })
  @IsEnum(PostEnum)
  @IsNotEmpty()
  postType: PostEnum;

  @ApiProperty({
    description: 'e.g - my-url',
    example: 'my-blog-post',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "A slug should be all small letters and uses only '-' and without spaces. e.g 'my-url'",
  })
  slug: string;

  @ApiProperty({
    enum: StatusEnum,
    description: "Possible values 'draft', 'scheduled', 'review', 'published'",
  })
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;

  @ApiProperty({
    description: 'This is the content of the post',
    example: 'The post content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your JSON object else a validation error will be thrown',
    example:
      '{\r\n "@context": "https://schema.org",\r\n "@type": "Person"\r\n}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured image for your blog post',
    example: 'http://localhost:3000/image/image1.png',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'The date on which the blog post is published.',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  publishedOn?: Date;

  @ApiPropertyOptional({
    description: 'An array of tags passed as string values',
    example: ['nestjs', 'typescript'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          example: 'sidebarEnabled',
          description:
            'The key can be any string identifier for your meta option',
        },
        value: {
          type: 'any',
          description: 'Any value that you want to save to the key.',
          example: true,
        },
      },
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
