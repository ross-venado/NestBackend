import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusinessesService } from '../businesses/businesses.service';
import { toSlug } from '../common/utils/slug.util';
import { CreateBusinessCatalogCategoryDto } from './dto/create-business-catalog-category.dto';
import { UpdateBusinessCatalogCategoryDto } from './dto/update-business-catalog-category.dto';
import {
  BusinessCatalogCategory,
  BusinessCatalogCategoryDocument,
} from './schemas/business-catalog-category.schema';

@Injectable()
export class BusinessCatalogCategoriesService {
  constructor(
    @InjectModel(BusinessCatalogCategory.name)
    private categoryModel: Model<BusinessCatalogCategoryDocument>,
    private readonly businessesService: BusinessesService,
  ) {}

  async findByOwner(ownerId: string | Types.ObjectId) {
    const business = await this.businessesService.findByOwner(ownerId);
    return this.categoryModel
      .find({ businessId: business._id })
      .sort({ type: 1, name: 1 })
      .exec();
  }

  async createForOwner(
    ownerId: string | Types.ObjectId,
    data: CreateBusinessCatalogCategoryDto,
  ) {
    const business = await this.businessesService.findByOwner(ownerId);
    return this.categoryModel.create({
      ...data,
      businessId: business._id,
      slug: data.slug ? toSlug(data.slug) : toSlug(data.name),
    });
  }

  async updateForOwner(
    ownerId: string | Types.ObjectId,
    id: string,
    data: UpdateBusinessCatalogCategoryDto,
  ) {
    const business = await this.businessesService.findByOwner(ownerId);
    const category = await this.categoryModel
      .findOneAndUpdate(
        { _id: id, businessId: business._id },
        {
          ...data,
          ...(data.slug ? { slug: toSlug(data.slug) } : {}),
        },
        { new: true },
      )
      .exec();

    if (!category) {
      throw new NotFoundException('Catalog category not found');
    }

    return category;
  }

  async deleteForOwner(ownerId: string | Types.ObjectId, id: string) {
    const business = await this.businessesService.findByOwner(ownerId);
    const category = await this.categoryModel
      .findOneAndDelete({ _id: id, businessId: business._id })
      .exec();

    if (!category) {
      throw new NotFoundException('Catalog category not found');
    }

    return { deleted: true };
  }
}
