import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RestaurantAccessService } from '../restaurant-common/restaurant-access.service';
import { toSlug } from '../common/utils/slug.util';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import {
  RestaurantTable,
  RestaurantTableDocument,
} from './schemas/restaurant-table.schema';

@Injectable()
export class RestaurantTablesService {
  constructor(
    @InjectModel(RestaurantTable.name)
    private tableModel: Model<RestaurantTableDocument>,
    private readonly restaurantAccessService: RestaurantAccessService,
  ) {}

  async createForOwner(
    ownerId: string | Types.ObjectId,
    data: CreateRestaurantTableDto,
  ) {
    const business =
      await this.restaurantAccessService.getOwnerRestaurantBusiness(ownerId);
    const code = data.code || data.name;
    return this.tableModel.create({
      ...data,
      businessId: business._id,
      code,
      qrSlug: data.qrSlug ? toSlug(data.qrSlug) : toSlug(code),
      active: data.active ?? true,
    });
  }

  async findByOwner(ownerId: string | Types.ObjectId) {
    const business =
      await this.restaurantAccessService.getOwnerRestaurantBusiness(ownerId);
    return this.tableModel
      .find({ businessId: business._id })
      .sort({ name: 1 })
      .exec();
  }

  async findOneForOwner(ownerId: string | Types.ObjectId, id: string) {
    const business =
      await this.restaurantAccessService.getOwnerRestaurantBusiness(ownerId);
    const table = await this.tableModel
      .findOne({ _id: id, businessId: business._id })
      .exec();
    if (!table) throw new NotFoundException('Restaurant table not found');
    return table;
  }

  async updateForOwner(
    ownerId: string | Types.ObjectId,
    id: string,
    data: UpdateRestaurantTableDto,
  ) {
    const business =
      await this.restaurantAccessService.getOwnerRestaurantBusiness(ownerId);
    const table = await this.tableModel
      .findOneAndUpdate(
        { _id: id, businessId: business._id },
        {
          ...data,
          ...(data.qrSlug ? { qrSlug: toSlug(data.qrSlug) } : {}),
        },
        { new: true },
      )
      .exec();
    if (!table) throw new NotFoundException('Restaurant table not found');
    return table;
  }

  async deleteForOwner(ownerId: string | Types.ObjectId, id: string) {
    const business =
      await this.restaurantAccessService.getOwnerRestaurantBusiness(ownerId);
    const table = await this.tableModel
      .findOneAndDelete({ _id: id, businessId: business._id })
      .exec();
    if (!table) throw new NotFoundException('Restaurant table not found');
    return { deleted: true };
  }

  async findPublicByBusinessAndQrSlug(businessSlug: string, qrSlug: string) {
    const business =
      await this.restaurantAccessService.getPublicRestaurantBusiness(
        businessSlug,
      );
    const table = await this.tableModel
      .findOne({ businessId: business._id, qrSlug, active: true })
      .exec();
    if (!table) throw new NotFoundException('Restaurant table not found');
    return { business, table };
  }
}
