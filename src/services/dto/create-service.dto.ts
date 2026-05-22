import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ServiceStatus } from '../../common/enums/service-status.enum';

export class CreateServiceDto {
  @ApiProperty({ example: 'Cambio de aceite' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'cambio-de-aceite' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Servicio de cambio de aceite para sedan y pickup',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  priceFrom?: number;

  @ApiPropertyOptional({ example: 350 })
  @IsOptional()
  @IsNumber()
  priceTo?: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://example.com/servicio.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 'Mantenimiento' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ServiceStatus, example: ServiceStatus.Active })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @ApiPropertyOptional({
    type: Object,
    example: { durationMinutes: 45, appointmentRequired: true },
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, unknown>;
}
