import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusinessesService } from '../businesses/businesses.service';
import { toSlug } from '../common/utils/slug.util';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service, ServiceDocument } from './schemas/service.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    private readonly businessesService: BusinessesService,
  ) {}

  async findByOwner(ownerId: string | Types.ObjectId) {
    const business = await this.businessesService.findByOwner(ownerId);
    return this.serviceModel
      .find({ businessId: business._id })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPublicByBusinessSlug(slug: string) {
    const business = await this.businessesService.findPublicBySlug(slug);
    return this.serviceModel
      .find({ businessId: business._id, status: 'active' })
      .sort({ createdAt: -1 })
      .exec();
  }

  async createForOwner(
    ownerId: string | Types.ObjectId,
    data: CreateServiceDto,
  ) {
    const business = await this.businessesService.findByOwner(ownerId);
    return this.serviceModel.create({
      ...data,
      businessId: business._id,
      slug: data.slug ? toSlug(data.slug) : toSlug(data.name),
    });
  }

  async updateForOwner(
    ownerId: string | Types.ObjectId,
    id: string,
    data: UpdateServiceDto,
  ) {
    const business = await this.businessesService.findByOwner(ownerId);
    const service = await this.serviceModel
      .findOneAndUpdate(
        { _id: id, businessId: business._id },
        {
          ...data,
          ...(data.slug ? { slug: toSlug(data.slug) } : {}),
        },
        { new: true },
      )
      .exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async deleteForOwner(ownerId: string | Types.ObjectId, id: string) {
    const business = await this.businessesService.findByOwner(ownerId);
    const service = await this.serviceModel
      .findOneAndDelete({ _id: id, businessId: business._id })
      .exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return { deleted: true };
  }
}
