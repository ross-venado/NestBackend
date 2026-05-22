import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from '../products/products.service';
import { RestaurantTablesService } from '../restaurant-tables/restaurant-tables.service';
import { CreatePublicRestaurantOrderDto } from './dto/create-public-restaurant-order.dto';
import { RestaurantOrdersService } from './restaurant-orders.service';

@ApiTags('Public restaurant QR')
@Controller('public/restaurants/:businessSlug/tables/:qrSlug')
export class PublicRestaurantOrdersController {
  constructor(
    private readonly tablesService: RestaurantTablesService,
    private readonly ordersService: RestaurantOrdersService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  async table(
    @Param('businessSlug') businessSlug: string,
    @Param('qrSlug') qrSlug: string,
  ) {
    const { business, table } =
      await this.tablesService.findPublicByBusinessAndQrSlug(
        businessSlug,
        qrSlug,
      );
    const products =
      await this.productsService.findPublicByBusinessSlug(businessSlug);
    return { business, table, products };
  }

  @Post('orders')
  createOrder(
    @Param('businessSlug') businessSlug: string,
    @Param('qrSlug') qrSlug: string,
    @Body() data: CreatePublicRestaurantOrderDto,
  ) {
    return this.ordersService.createPublicByQr(businessSlug, qrSlug, data);
  }
}
