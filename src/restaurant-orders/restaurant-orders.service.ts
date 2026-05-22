import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { RestaurantAccessService } from '../restaurant-common/restaurant-access.service';
import { RestaurantTableDocument } from '../restaurant-tables/schemas/restaurant-table.schema';
import { RestaurantTablesService } from '../restaurant-tables/restaurant-tables.service';
import { RestaurantOrderStatus } from '../common/enums/restaurant-order-status.enum';
import { CreatePublicRestaurantOrderDto } from './dto/create-public-restaurant-order.dto';
import { CreateRestaurantOrderDto } from './dto/create-restaurant-order.dto';
import { UpdateRestaurantOrderStatusDto } from './dto/update-restaurant-order-status.dto';
import {
  RestaurantOrder,
  RestaurantOrderDocument,
  RestaurantOrderItem,
} from './schemas/restaurant-order.schema';

@Injectable()
export class RestaurantOrdersService {
  constructor(
    @InjectModel(RestaurantOrder.name)
    private orderModel: Model<RestaurantOrderDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private readonly restaurantAccessService: RestaurantAccessService,
    private readonly restaurantTablesService: RestaurantTablesService,
  ) {}

  async createForOwner(
    ownerId: string | Types.ObjectId,
    data: CreateRestaurantOrderDto,
  ) {
    const business =
      await this.restaurantAccessService.getOwnerRestaurantBusiness(ownerId);
    const table = await this.restaurantTablesService.findOneForOwner(
      ownerId,
      data.tableId,
    );
    return this.createOrder(business._id, table, data, ownerId);
  }

  async createPublicByQr(
    businessSlug: string,
    qrSlug: string,
    data: CreatePublicRestaurantOrderDto,
  ) {
    const { business, table } =
      await this.restaurantTablesService.findPublicByBusinessAndQrSlug(
        businessSlug,
        qrSlug,
      );
    return this.createOrder(business._id, table, {
      ...data,
      tableId: table._id.toString(),
    });
  }

  async findByOwner(
    ownerId: string | Types.ObjectId,
    status?: RestaurantOrderStatus,
  ) {
    const business =
      await this.restaurantAccessService.getOwnerRestaurantBusiness(ownerId);
    return this.orderModel
      .find({ businessId: business._id, ...(status ? { status } : {}) })
      .populate('tableId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOneForOwner(ownerId: string | Types.ObjectId, id: string) {
    const business =
      await this.restaurantAccessService.getOwnerRestaurantBusiness(ownerId);
    const order = await this.orderModel
      .findOne({ _id: id, businessId: business._id })
      .populate('tableId')
      .exec();
    if (!order) throw new NotFoundException('Restaurant order not found');
    return order;
  }

  async updateStatusForOwner(
    ownerId: string | Types.ObjectId,
    id: string,
    data: UpdateRestaurantOrderStatusDto,
  ) {
    const business =
      await this.restaurantAccessService.getOwnerRestaurantBusiness(ownerId);
    const order = await this.orderModel
      .findOneAndUpdate(
        { _id: id, businessId: business._id },
        { status: data.status },
        { new: true },
      )
      .populate('tableId')
      .exec();
    if (!order) throw new NotFoundException('Restaurant order not found');
    return order;
  }

  async deleteForOwner(ownerId: string | Types.ObjectId, id: string) {
    const business =
      await this.restaurantAccessService.getOwnerRestaurantBusiness(ownerId);
    const order = await this.orderModel
      .findOneAndDelete({ _id: id, businessId: business._id })
      .exec();
    if (!order) throw new NotFoundException('Restaurant order not found');
    return { deleted: true };
  }

  private async createOrder(
    businessId: Types.ObjectId,
    table: RestaurantTableDocument,
    data: CreateRestaurantOrderDto,
    createdBy?: string | Types.ObjectId,
  ) {
    if (!data.items?.length) {
      throw new BadRequestException('Order must include at least one item');
    }

    const productIds = data.items.map(
      (item) => new Types.ObjectId(item.productId),
    );
    const products = await this.productModel
      .find({
        _id: { $in: productIds },
        businessId,
        status: 'active',
      })
      .exec();

    const productMap = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    const items: RestaurantOrderItem[] = data.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestException('Order includes an invalid product');
      }

      const subtotal = product.price * item.quantity;
      return {
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        notes: item.notes,
        subtotal,
      };
    });

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const orderNumber = await this.nextOrderNumber(businessId);

    return this.orderModel.create({
      businessId,
      tableId: table._id,
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      status: RestaurantOrderStatus.New,
      items,
      total,
      notes: data.notes,
      createdBy,
    });
  }

  private async nextOrderNumber(businessId: Types.ObjectId) {
    const lastOrder = await this.orderModel
      .findOne({ businessId })
      .sort({ orderNumber: -1 })
      .select('orderNumber')
      .exec();
    return (lastOrder?.orderNumber || 0) + 1;
  }
}
