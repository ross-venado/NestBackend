import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Business } from '../../businesses/schemas/business.schema';
import { ServiceStatus } from '../../common/enums/service-status.enum';

export type ServiceDocument = HydratedDocument<Service>;

@Schema({ timestamps: true })
export class Service {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Business.name,
    required: true,
    index: true,
  })
  businessId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop()
  priceFrom?: number;

  @Prop()
  priceTo?: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  category?: string;

  @Prop({ enum: ServiceStatus, default: ServiceStatus.Active, index: true })
  status: ServiceStatus;

  @Prop({ type: Object, default: {} })
  attributes: Record<string, unknown>;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
ServiceSchema.index({ businessId: 1, status: 1 });
ServiceSchema.index({ businessId: 1, slug: 1 }, { unique: true });
