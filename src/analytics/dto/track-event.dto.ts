import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsObject, IsOptional } from 'class-validator';

export class TrackEventDto {
  @ApiProperty({
    enum: ['business_view', 'whatsapp_click', 'product_view', 'service_view'],
    example: 'whatsapp_click',
  })
  @IsIn(['business_view', 'whatsapp_click', 'product_view', 'service_view'])
  type: string;

  @ApiPropertyOptional({
    type: Object,
    example: { source: 'business_profile' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
