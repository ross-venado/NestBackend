import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Business } from '../../businesses/schemas/business.schema';

export type AnalyticsEventDocument = HydratedDocument<AnalyticsEvent>;

@Schema({ timestamps: true })
export class AnalyticsEvent {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Business.name,
    required: true,
    index: true,
  })
  businessId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['business_view', 'whatsapp_click', 'product_view', 'service_view'],
    index: true,
  })
  type: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, unknown>;
}

export const AnalyticsEventSchema =
  SchemaFactory.createForClass(AnalyticsEvent);
AnalyticsEventSchema.index({ businessId: 1, type: 1, createdAt: -1 });
