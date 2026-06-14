import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BusinessModule } from '../../common/enums/business-module.enum';
import { PlanCode } from '../../common/enums/plan-code.enum';
import { LocationDto } from './location.dto';

export class CreateBusinessDto {
  @ApiProperty({ example: 'La Esquina Chimalteca' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'la-esquina-chimalteca' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Comida casera y antojitos en Chimaltenango',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '6a100fb200f04d637bf91605' })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({ example: '50255550000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '50255550000' })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional({ example: '1a calle zona 2, Chimaltenango' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: LocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiPropertyOptional({ example: 'https://example.com/logo.jpg' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiPropertyOptional({ enum: PlanCode, example: PlanCode.Free })
  @IsOptional()
  @IsEnum(PlanCode)
  plan?: PlanCode;

  @ApiPropertyOptional({
    enum: BusinessModule,
    isArray: true,
    example: [BusinessModule.Marketplace, BusinessModule.Inventory],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(BusinessModule, { each: true })
  modules?: BusinessModule[];
}
