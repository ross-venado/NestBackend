import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RestaurantOrderStatus } from '../../common/enums/restaurant-order-status.enum';

export class UpdateRestaurantOrderStatusDto {
  @ApiProperty({
    enum: RestaurantOrderStatus,
    example: RestaurantOrderStatus.Preparing,
  })
  @IsEnum(RestaurantOrderStatus)
  status: RestaurantOrderStatus;
}
