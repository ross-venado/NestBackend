import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductStatus } from '../../common/enums/product-status.enum';

export class CreateProductDto {
  @ApiProperty({ example: 'Hamburguesa artesanal' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'hamburguesa-artesanal' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Pan artesanal, torta de res y papas' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 45 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://example.com/hamburguesa.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 'Hamburguesas' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({ enum: ProductStatus, example: ProductStatus.Active })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    type: Object,
    example: { size: 'grande', spicy: false },
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, unknown>;
}
