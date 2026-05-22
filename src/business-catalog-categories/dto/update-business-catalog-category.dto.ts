import { PartialType } from '@nestjs/swagger';
import { CreateBusinessCatalogCategoryDto } from './create-business-catalog-category.dto';

export class UpdateBusinessCatalogCategoryDto extends PartialType(
  CreateBusinessCatalogCategoryDto,
) {}
