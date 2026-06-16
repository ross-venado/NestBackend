import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Business } from '../../businesses/schemas/business.schema';
import { Product } from '../../products/schemas/product.schema';
import { LiveLeadStatus } from '../../common/enums/live-lead-status.enum';
import { LiveSession } from './live-session.schema';

export type LiveLeadDocument = HydratedDocument<LiveLead>;

@Schema({ timestamps: true })
export class LiveLead {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Business.name,
    required: true,
    index: true,
  })
  businessId: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: LiveSession.name,
    required: true,
    index: true,
  })
  sessionId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  productName: string;

  @Prop({ required: true, trim: true })
  customerName: string;

  @Prop({ trim: true })
  size?: string;

  @Prop({ default: 1 })
  quantity: number;

  @Prop({ trim: true })
  notes?: string;

  @Prop({ enum: LiveLeadStatus, default: LiveLeadStatus.New, index: true })
  status: LiveLeadStatus;
}

export const LiveLeadSchema = SchemaFactory.createForClass(LiveLead);
LiveLeadSchema.index({ businessId: 1, sessionId: 1, createdAt: -1 });
