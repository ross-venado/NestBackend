import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BusinessModule } from '../../common/enums/business-module.enum';
import { BusinessStatus } from '../../common/enums/business-status.enum';
import { PlanCode } from '../../common/enums/plan-code.enum';
import { BusinessCategory } from '../../business-categories/schemas/business-category.schema';
import { User } from '../../users/schemas/user.schema';

export type BusinessDocument = HydratedDocument<Business>;

@Schema({ timestamps: true })
export class Business {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: BusinessCategory.name, index: true })
  categoryId?: Types.ObjectId;

  @Prop()
  phone?: string;

  @Prop()
  whatsapp?: string;

  @Prop()
  address?: string;

  @Prop({ type: { lat: Number, lng: Number }, _id: false })
  location?: { lat: number; lng: number };

  @Prop()
  logoUrl?: string;

  @Prop()
  coverUrl?: string;

  @Prop({ enum: BusinessStatus, default: BusinessStatus.Draft, index: true })
  status: BusinessStatus;

  @Prop({ enum: PlanCode, default: PlanCode.Free, index: true })
  plan: PlanCode;

  @Prop({
    type: [String],
    enum: BusinessModule,
    default: [BusinessModule.Marketplace],
  })
  modules: BusinessModule[];
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
