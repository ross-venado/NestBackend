import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RestaurantOrderItemInputDto {
  @ApiProperty({ example: '6a1057f78dcea25785cf4767' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: 'Sin cebolla' })
  @IsOptional()
  @IsString()
  notes?: string;
}
