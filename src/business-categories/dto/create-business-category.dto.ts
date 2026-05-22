import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateBusinessCategoryDto {
  @ApiProperty({ example: 'Comida y restaurantes' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'comida-y-restaurantes' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Restaurantes, comedores y ventas de comida',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'utensils' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
