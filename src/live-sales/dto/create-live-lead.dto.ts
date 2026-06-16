import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateLiveLeadDto {
  @IsString()
  productId: string;

  @IsString()
  @MaxLength(70)
  customerName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  size?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  notes?: string;
}
