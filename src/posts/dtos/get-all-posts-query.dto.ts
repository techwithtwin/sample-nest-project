import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetAllPostsQueryDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  userId: number;
}
