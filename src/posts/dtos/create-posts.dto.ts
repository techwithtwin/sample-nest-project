import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

enum PostEnum {
  POST = 'POST',
  PAGE = 'PAGE',
  STORY = 'story',
  SERIES = 'series',
}

enum StatusEnum {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  REVIEW = 'REVIEW',
  PUBLISHED = 'PUBLISHED',
}

export class CreatePostDto {
  @IsString()
  title: string;

  @IsEnum(PostEnum)
  postType: 'post' | 'page' | 'story' | 'series';

  slug: string;

  @IsEnum(StatusEnum)
  status: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  schema?: string;

  @IsOptional()
  featuredImageUrl?: string;

  @IsDate()
  publishedOn: Date;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  tags: string[];

  metaOptions: Map<string, string>;
}
