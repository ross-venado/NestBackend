import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Business } from '../../businesses/schemas/business.schema';
import { Product } from '../../products/schemas/product.schema';
import { LiveSessionItemStatus } from '../../common/enums/live-session-item-status.enum';
import { LiveSessionStatus } from '../../common/enums/live-session-status.enum';

export type LiveSessionDocument = HydratedDocument<LiveSession>;

@Schema({ _id: false })
export class LiveSessionItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, uppercase: true, trim: true })
  code: string;

  @Prop()
  stockOverride?: number;

  @Prop({
    enum: LiveSessionItemStatus,
    default: LiveSessionItemStatus.Available,
  })
  status: LiveSessionItemStatus;
}

export const LiveSessionItemSchema =
  SchemaFactory.createForClass(LiveSessionItem);

@Schema({ timestamps: true })
export class LiveSession {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Business.name,
    required: true,
    index: true,
  })
  businessId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ enum: LiveSessionStatus, default: LiveSessionStatus.Draft, index: true })
  status: LiveSessionStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: Product.name })
  currentProductId?: Types.ObjectId;

  @Prop({ type: [SchemaTypes.ObjectId], ref: Product.name, default: [] })
  shownProductIds: Types.ObjectId[];

  @Prop({ type: [LiveSessionItemSchema], default: [] })
  items: LiveSessionItem[];
}

export const LiveSessionSchema = SchemaFactory.createForClass(LiveSession);
LiveSessionSchema.index({ businessId: 1, slug: 1 }, { unique: true });
