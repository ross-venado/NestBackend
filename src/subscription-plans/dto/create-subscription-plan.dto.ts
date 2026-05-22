import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PlanCode } from '../../common/enums/plan-code.enum';

export class CreateSubscriptionPlanDto {
  @ApiProperty({ enum: PlanCode, example: PlanCode.Basic })
  @IsEnum(PlanCode)
  code: PlanCode;

  @ApiProperty({ example: 'Basic' })
  @IsString()
  name: string;

  @ApiProperty({ example: 99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  productLimit: number;

  @ApiProperty({
    type: [String],
    example: ['QR', 'ubicación', 'WhatsApp', '1 promoción futura'],
  })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
