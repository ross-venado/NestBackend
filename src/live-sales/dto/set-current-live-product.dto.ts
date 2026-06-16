import { IsString } from 'class-validator';

export class SetCurrentLiveProductDto {
  @IsString()
  productId: string;
}
