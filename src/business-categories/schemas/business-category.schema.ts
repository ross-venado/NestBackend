import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BusinessCategoryDocument = HydratedDocument<BusinessCategory>;

@Schema({ timestamps: true })
export class BusinessCategory {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop()
  icon?: string;

  @Prop({ default: true })
  active: boolean;
}

export const BusinessCategorySchema =
  SchemaFactory.createForClass(BusinessCategory);
