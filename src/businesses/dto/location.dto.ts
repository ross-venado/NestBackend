import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LocationDto {
  @ApiProperty({ example: 14.6611 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: -90.8194 })
  @IsNumber()
  lng: number;
}
