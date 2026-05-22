import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toSlug } from '../common/utils/slug.util';
import {
  BusinessCategory,
  BusinessCategoryDocument,
} from './schemas/business-category.schema';
import { CreateBusinessCategoryDto } from './dto/create-business-category.dto';
import { UpdateBusinessCategoryDto } from './dto/update-business-category.dto';

@Injectable()
export class BusinessCategoriesService {
  constructor(
    @InjectModel(BusinessCategory.name)
    private categoryModel: Model<BusinessCategoryDocument>,
  ) {}

  findPublic() {
    return this.categoryModel.find({ active: true }).sort({ name: 1 }).exec();
  }

  findAll() {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  create(data: CreateBusinessCategoryDto) {
    return this.categoryModel.create({
      ...data,
      slug: data.slug ? toSlug(data.slug) : toSlug(data.name),
    });
  }

  async update(id: string, data: UpdateBusinessCategoryDto) {
    const category = await this.categoryModel
      .findByIdAndUpdate(
        id,
        {
          ...data,
          ...(data.slug ? { slug: toSlug(data.slug) } : {}),
        },
        { new: true },
      )
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
