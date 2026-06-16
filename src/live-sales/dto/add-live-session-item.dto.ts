import { IsOptional, IsString, MaxLength, Min, IsNumber } from 'class-validator';

export class AddLiveSessionItemDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  code?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockOverride?: number;
}
