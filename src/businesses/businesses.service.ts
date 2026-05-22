import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusinessStatus } from '../common/enums/business-status.enum';
import { BusinessModule } from '../common/enums/business-module.enum';
import { PlanCode } from '../common/enums/plan-code.enum';
import { toSlug } from '../common/utils/slug.util';
import { Business, BusinessDocument } from './schemas/business.schema';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UpdateBusinessStatusDto } from './dto/update-business-status.dto';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) {}

  findPublic() {
    return this.businessModel
      .find({ status: BusinessStatus.Active })
      .populate('categoryId')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findPublicBySlug(slug: string) {
    const business = await this.businessModel
      .findOne({ slug, status: BusinessStatus.Active })
      .populate('categoryId')
      .exec();
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return business;
  }

  findAdmin() {
    return this.businessModel
      .find()
      .populate('categoryId')
      .populate('ownerId', 'name email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByOwner(ownerId: string | Types.ObjectId) {
    const business = await this.businessModel
      .findOne({ ownerId })
      .populate('categoryId')
      .exec();
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return business;
  }

  async findById(id: string | Types.ObjectId) {
    const business = await this.businessModel.findById(id).exec();
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return business;
  }

  async upsertOwnerBusiness(
    ownerId: string | Types.ObjectId,
    data: UpdateBusinessDto,
  ) {
    const existing = await this.businessModel.findOne({ ownerId }).exec();
    if (existing) {
      Object.assign(existing, {
        ...data,
        ...(data.slug ? { slug: toSlug(data.slug) } : {}),
      });
      return existing.save();
    }

    if (!data.name) {
      throw new NotFoundException('Business not found');
    }

    return this.businessModel.create({
      ...data,
      ownerId,
      slug: data.slug ? toSlug(data.slug) : toSlug(data.name),
      status: BusinessStatus.Draft,
      plan: data.plan || PlanCode.Free,
      modules: data.modules?.length
        ? data.modules
        : [BusinessModule.Marketplace],
    });
  }

  async updateStatus(id: string, data: UpdateBusinessStatusDto) {
    const business = await this.businessModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return business;
  }
}
