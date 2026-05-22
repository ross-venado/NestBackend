import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CatalogCategoryType } from '../../common/enums/catalog-category-type.enum';

export class CreateBusinessCatalogCategoryDto {
  @ApiProperty({ example: 'Hamburguesas' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'hamburguesas' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Productos principales del menu' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: CatalogCategoryType,
    example: CatalogCategoryType.Product,
  })
  @IsOptional()
  @IsEnum(CatalogCategoryType)
  type?: CatalogCategoryType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
