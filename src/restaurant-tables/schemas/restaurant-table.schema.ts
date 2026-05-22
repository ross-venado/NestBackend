import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Business } from '../../businesses/schemas/business.schema';
import { RestaurantTableStatus } from '../../common/enums/restaurant-table-status.enum';

export type RestaurantTableDocument = HydratedDocument<RestaurantTable>;

@Schema({ timestamps: true })
export class RestaurantTable {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Business.name,
    required: true,
    index: true,
  })
  businessId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  code: string;

  @Prop({ required: true, lowercase: true, trim: true })
  qrSlug: string;

  @Prop({
    enum: RestaurantTableStatus,
    default: RestaurantTableStatus.Free,
    index: true,
  })
  status: RestaurantTableStatus;

  @Prop({ default: true, index: true })
  active: boolean;
}

export const RestaurantTableSchema =
  SchemaFactory.createForClass(RestaurantTable);
RestaurantTableSchema.index({ businessId: 1, status: 1 });
RestaurantTableSchema.index({ businessId: 1, qrSlug: 1 }, { unique: true });
RestaurantTableSchema.index({ businessId: 1, code: 1 }, { unique: true });
