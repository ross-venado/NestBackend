import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Business } from '../../businesses/schemas/business.schema';
import { Product } from '../../products/schemas/product.schema';
import { RestaurantTable } from '../../restaurant-tables/schemas/restaurant-table.schema';
import { RestaurantOrderStatus } from '../../common/enums/restaurant-order-status.enum';

export type RestaurantOrderDocument = HydratedDocument<RestaurantOrder>;

@Schema({ _id: false })
export class RestaurantOrderItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop()
  notes?: string;

  @Prop({ required: true, min: 0 })
  subtotal: number;
}

export const RestaurantOrderItemSchema =
  SchemaFactory.createForClass(RestaurantOrderItem);

@Schema({ timestamps: true })
export class RestaurantOrder {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Business.name,
    required: true,
    index: true,
  })
  businessId: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: RestaurantTable.name,
    required: true,
    index: true,
  })
  tableId: Types.ObjectId;

  @Prop({ required: true, index: true })
  orderNumber: number;

  @Prop()
  customerName?: string;

  @Prop()
  customerPhone?: string;

  @Prop({
    enum: RestaurantOrderStatus,
    default: RestaurantOrderStatus.New,
    index: true,
  })
  status: RestaurantOrderStatus;

  @Prop({ type: [RestaurantOrderItemSchema], default: [] })
  items: RestaurantOrderItem[];

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop()
  notes?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;
}

export const RestaurantOrderSchema =
  SchemaFactory.createForClass(RestaurantOrder);
RestaurantOrderSchema.index({ businessId: 1, status: 1 });
RestaurantOrderSchema.index({ businessId: 1, tableId: 1 });
RestaurantOrderSchema.index(
  { businessId: 1, orderNumber: 1 },
  { unique: true },
);
