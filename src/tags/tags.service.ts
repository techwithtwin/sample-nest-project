import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepo: Repository<Tag>,
  ) {}

  async createTag(createTagDto: CreateTagDto) {
    try {
      const newTag = this.tagsRepo.create(createTagDto);
      return await this.tagsRepo.save(newTag);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw new HttpException('Failed to create tag', 500);
    }
  }

  async getAllTags() {
    return await this.tagsRepo.find();
  }

  async findMultipleTags(tags: number[]) {
    const result = await this.tagsRepo.find({
      where: {
        id: In(tags),
      },
    });

    return result;
  }

  async deleteTag(id: number) {
    await this.tagsRepo.delete(id);

    return {
      deleted: true,
      id,
    };
  }
  async softDeleteTag(id: number) {
    await this.tagsRepo.softDelete(id);

    return {
      deleted: true,
      id,
    };
  }
}
