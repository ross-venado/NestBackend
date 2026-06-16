import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusinessesService } from '../businesses/businesses.service';
import { Business } from '../businesses/schemas/business.schema';
import { BusinessModule } from '../common/enums/business-module.enum';
import { LiveLeadStatus } from '../common/enums/live-lead-status.enum';
import { LiveSessionItemStatus } from '../common/enums/live-session-item-status.enum';
import { LiveSessionStatus } from '../common/enums/live-session-status.enum';
import { ProductStatus } from '../common/enums/product-status.enum';
import { toSlug } from '../common/utils/slug.util';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { AddLiveSessionItemDto } from './dto/add-live-session-item.dto';
import { CreateLiveLeadDto } from './dto/create-live-lead.dto';
import { CreateLiveSessionDto } from './dto/create-live-session.dto';
import { UpdateLiveSessionItemDto } from './dto/update-live-session-item.dto';
import { UpdateLiveSessionDto } from './dto/update-live-session.dto';
import { LiveLead, LiveLeadDocument } from './schemas/live-lead.schema';
import {
  LiveSession,
  LiveSessionDocument,
} from './schemas/live-session.schema';

type LiveSessionWithProducts = LiveSession & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

@Injectable()
export class LiveSalesService {
  constructor(
    @InjectModel(LiveSession.name)
    private liveSessionModel: Model<LiveSessionDocument>,
    @InjectModel(LiveLead.name)
    private liveLeadModel: Model<LiveLeadDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private readonly businessesService: BusinessesService,
  ) {}

  async createForOwner(
    ownerId: string | Types.ObjectId,
    data: CreateLiveSessionDto,
  ) {
    const business = await this.businessesService.findByOwner(ownerId);
    this.assertLiveSalesEnabled(business);
    const productIds = data.productIds || [];
    const products = productIds.length
      ? await this.findProductsForBusiness(business._id, productIds)
      : [];

    const session = await this.liveSessionModel.create({
      businessId: business._id,
      title: data.title,
      slug: data.slug ? toSlug(data.slug) : toSlug(data.title),
      status: LiveSessionStatus.Draft,
      items: products.map((product, index) => ({
        productId: product._id,
        code: this.nextCode(index),
        stockOverride: product.stock,
        status: LiveSessionItemStatus.Available,
      })),
    });

    return this.toPayload(session, business);
  }

  async findByOwner(ownerId: string | Types.ObjectId) {
    const business = await this.businessesService.findByOwner(ownerId);
    this.assertLiveSalesEnabled(business);
    const sessions = await this.liveSessionModel
      .find({ businessId: business._id })
      .sort({ updatedAt: -1 })
      .exec();

    return Promise.all(
      sessions.map((session) => this.toPayload(session, business)),
    );
  }

  async findOneForOwner(ownerId: string | Types.ObjectId, id: string) {
    const { business, session } = await this.getOwnerSession(ownerId, id);
    return this.toPayload(session, business);
  }

  async updateForOwner(
    ownerId: string | Types.ObjectId,
    id: string,
    data: UpdateLiveSessionDto,
  ) {
    const { business, session } = await this.getOwnerSession(ownerId, id);

    if (data.title !== undefined) session.title = data.title;
    if (data.status !== undefined) {
      session.status = data.status;
      if (data.status === LiveSessionStatus.Ended) {
        const currentProductId = session.currentProductId
          ? String(session.currentProductId)
          : '';
        const wasShown = session.shownProductIds.some(
          (shownProductId) => String(shownProductId) === currentProductId,
        );
        if (currentProductId && !wasShown) {
          session.shownProductIds.push(new Types.ObjectId(currentProductId));
        }
        session.set('currentProductId', undefined);
      }
    }

    await session.save();
    return this.toPayload(session, business);
  }

  async addItemForOwner(
    ownerId: string | Types.ObjectId,
    id: string,
    data: AddLiveSessionItemDto,
  ) {
    const { business, session } = await this.getOwnerSession(ownerId, id);
    const [product] = await this.findProductsForBusiness(business._id, [
      data.productId,
    ]);
    const productId = String(product._id);

    if (session.items.some((item) => String(item.productId) === productId)) {
      throw new BadRequestException('Product already added to this live');
    }

    const code = (data.code || this.nextCode(session.items.length)).toUpperCase();
    if (session.items.some((item) => item.code === code)) {
      throw new BadRequestException('Live code already exists');
    }

    session.items.push({
      productId: product._id,
      code,
      stockOverride: data.stockOverride ?? product.stock,
      status: LiveSessionItemStatus.Available,
    });
    await session.save();

    return this.toPayload(session, business);
  }

  async updateItemForOwner(
    ownerId: string | Types.ObjectId,
    id: string,
    productId: string,
    data: UpdateLiveSessionItemDto,
  ) {
    const { business, session } = await this.getOwnerSession(ownerId, id);
    const item = session.items.find(
      (sessionItem) => String(sessionItem.productId) === productId,
    );
    if (!item) throw new NotFoundException('Live product not found');

    if (
      data.code &&
      session.items.some(
        (sessionItem) =>
          sessionItem.code === data.code?.toUpperCase() &&
          String(sessionItem.productId) !== productId,
      )
    ) {
      throw new BadRequestException('Live code already exists');
    }

    if (data.code) item.code = data.code.toUpperCase();
    if (data.stockOverride !== undefined) item.stockOverride = data.stockOverride;
    if (data.status) item.status = data.status;
    await session.save();

    return this.toPayload(session, business);
  }

  async setCurrentProductForOwner(
    ownerId: string | Types.ObjectId,
    id: string,
    productId: string,
  ) {
    const { business, session } = await this.getOwnerSession(ownerId, id);
    const exists = session.items.some(
      (item) => String(item.productId) === productId,
    );
    if (!exists) throw new NotFoundException('Live product not found');

    const current = session.currentProductId
      ? String(session.currentProductId)
      : '';

    if (current && current !== productId) {
      const alreadyShown = session.shownProductIds.some(
        (shownProductId) => String(shownProductId) === current,
      );
      if (!alreadyShown) {
        session.shownProductIds.push(new Types.ObjectId(current));
      }
    }

    session.currentProductId = new Types.ObjectId(productId);
    session.status = LiveSessionStatus.Active;
    await session.save();

    return this.toPayload(session, business);
  }

  async findLeadsForOwner(ownerId: string | Types.ObjectId, sessionId: string) {
    const { business } = await this.getOwnerSession(ownerId, sessionId);
    return this.liveLeadModel
      .find({ businessId: business._id, sessionId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPublicSession(businessSlug: string, sessionSlug: string) {
    const business = await this.businessesService.findPublicBySlug(businessSlug);
    this.assertLiveSalesPublicEnabled(business);
    const session = await this.liveSessionModel
      .findOne({
        businessId: business._id,
        slug: sessionSlug,
        status: LiveSessionStatus.Active,
      })
      .exec();

    if (!session) throw new NotFoundException('Live session not found');

    return this.toPayload(session, business);
  }

  async createPublicLead(
    businessSlug: string,
    sessionSlug: string,
    data: CreateLiveLeadDto,
  ) {
    const business = await this.businessesService.findPublicBySlug(businessSlug);
    this.assertLiveSalesPublicEnabled(business);
    const session = await this.liveSessionModel
      .findOne({
        businessId: business._id,
        slug: sessionSlug,
        status: LiveSessionStatus.Active,
      })
      .exec();

    if (!session) throw new NotFoundException('Live session not found');
    const item = session.items.find(
      (sessionItem) => String(sessionItem.productId) === data.productId,
    );
    if (!item) throw new NotFoundException('Live product not found');
    if (item.status === LiveSessionItemStatus.SoldOut) {
      throw new BadRequestException('Product is sold out');
    }

    const [product] = await this.findProductsForBusiness(business._id, [
      data.productId,
    ]);

    if (item.stockOverride !== undefined) {
      item.stockOverride = Math.max(0, item.stockOverride - data.quantity);
      if (item.stockOverride === 0) {
        item.status = LiveSessionItemStatus.SoldOut;
      }
      await session.save();
    }

    return this.liveLeadModel.create({
      businessId: business._id,
      sessionId: session._id,
      productId: product._id,
      code: item.code,
      productName: product.name,
      customerName: data.customerName,
      size: data.size,
      quantity: data.quantity,
      notes: data.notes,
      status: LiveLeadStatus.New,
    });
  }

  private async getOwnerSession(
    ownerId: string | Types.ObjectId,
    id: string,
  ): Promise<{ business: Business & { _id: Types.ObjectId }; session: LiveSessionDocument }> {
    const business = (await this.businessesService.findByOwner(ownerId)) as Business & {
      _id: Types.ObjectId;
    };
    this.assertLiveSalesEnabled(business);
    const session = await this.liveSessionModel
      .findOne({ _id: id, businessId: business._id })
      .exec();
    if (!session) throw new NotFoundException('Live session not found');
    return { business, session };
  }

  private assertLiveSalesEnabled(business: Business) {
    if (!business.modules?.includes(BusinessModule.LiveSales)) {
      throw new ForbiddenException('Live sales module is not active for this business');
    }
  }

  private assertLiveSalesPublicEnabled(business: Business) {
    if (!business.modules?.includes(BusinessModule.LiveSales)) {
      throw new NotFoundException('Live session not found');
    }
  }

  private async findProductsForBusiness(
    businessId: Types.ObjectId,
    productIds: string[],
  ) {
    const products = await this.productModel
      .find({
        _id: { $in: productIds },
        businessId,
        status: { $ne: ProductStatus.Inactive },
      })
      .exec();

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products were not found');
    }

    return products;
  }

  private async toPayload(
    session: LiveSessionDocument,
    business: Business & { _id?: Types.ObjectId },
  ) {
    const productIds = session.items.map((item) => item.productId);
    const products = productIds.length
      ? await this.productModel.find({ _id: { $in: productIds } }).exec()
      : [];
    const productMap = new Map(products.map((product) => [String(product._id), product]));
    const shownProductIdSet = new Set(
      session.shownProductIds.map((productId) => String(productId)),
    );
    const currentProductId = session.currentProductId
      ? String(session.currentProductId)
      : '';
    const plainSession = session.toObject() as LiveSessionWithProducts;
    const items = plainSession.items.map((item) => {
      const product = productMap.get(String(item.productId));
      return {
        ...item,
        product,
        isCurrent: String(item.productId) === currentProductId,
        wasShown: shownProductIdSet.has(String(item.productId)),
      };
    });

    return {
      ...plainSession,
      business,
      items,
      currentProduct: currentProductId
        ? productMap.get(currentProductId) || null
        : null,
      shownProducts: items.filter((item) => item.wasShown),
    };
  }

  private nextCode(index: number) {
    return `A${index + 1}`;
  }
}
