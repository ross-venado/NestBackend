import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { RestaurantTableStatus } from '../../common/enums/restaurant-table-status.enum';

export class CreateRestaurantTableDto {
  @ApiProperty({ example: 'Mesa 1' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'M1' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'mesa-1' })
  @IsOptional()
  @IsString()
  qrSlug?: string;

  @ApiPropertyOptional({
    enum: RestaurantTableStatus,
    example: RestaurantTableStatus.Free,
  })
  @IsOptional()
  @IsEnum(RestaurantTableStatus)
  status?: RestaurantTableStatus;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
