import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Business } from '../../businesses/schemas/business.schema';
import { CatalogCategoryType } from '../../common/enums/catalog-category-type.enum';

export type BusinessCatalogCategoryDocument =
  HydratedDocument<BusinessCatalogCategory>;

@Schema({ timestamps: true })
export class BusinessCatalogCategory {
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

  @Prop({
    enum: CatalogCategoryType,
    default: CatalogCategoryType.Both,
    index: true,
  })
  type: CatalogCategoryType;

  @Prop({ default: true, index: true })
  active: boolean;
}

export const BusinessCatalogCategorySchema = SchemaFactory.createForClass(
  BusinessCatalogCategory,
);
BusinessCatalogCategorySchema.index(
  { businessId: 1, slug: 1 },
  { unique: true },
);
BusinessCatalogCategorySchema.index({ businessId: 1, type: 1, active: 1 });
