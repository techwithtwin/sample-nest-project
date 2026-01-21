import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetUserParamDto {
  @ApiProperty({
    description: 'Get user with a specific ID!',
    example: 1234,
  })
  @Type(() => Number)
  @IsInt()
  id: number;
}
