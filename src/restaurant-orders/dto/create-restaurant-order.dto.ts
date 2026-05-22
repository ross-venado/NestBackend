import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RestaurantOrderItemInputDto } from './restaurant-order-item-input.dto';

export class CreateRestaurantOrderDto {
  @ApiProperty({ example: '6a1057f78dcea25785cf4761' })
  @IsMongoId()
  tableId: string;

  @ApiPropertyOptional({ example: 'Juan Perez' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ example: '50255550000' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({
    type: [RestaurantOrderItemInputDto],
    example: [{ productId: '6a1057f78dcea25785cf4767', quantity: 2 }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestaurantOrderItemInputDto)
  items: RestaurantOrderItemInputDto[];

  @ApiPropertyOptional({ example: 'Mesa pide rapido' })
  @IsOptional()
  @IsString()
  notes?: string;
}
