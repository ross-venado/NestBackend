import { OmitType } from '@nestjs/swagger';
import { CreateRestaurantOrderDto } from './create-restaurant-order.dto';

export class CreatePublicRestaurantOrderDto extends OmitType(
  CreateRestaurantOrderDto,
  ['tableId'] as const,
) {}
