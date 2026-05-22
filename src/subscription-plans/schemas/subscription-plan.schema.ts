import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PlanCode } from '../../common/enums/plan-code.enum';

export type SubscriptionPlanDocument = HydratedDocument<SubscriptionPlan>;

@Schema({ timestamps: true })
export class SubscriptionPlan {
  @Prop({ enum: PlanCode, required: true, unique: true, lowercase: true })
  code: PlanCode;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ required: true, default: 3 })
  productLimit: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: true })
  active: boolean;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
