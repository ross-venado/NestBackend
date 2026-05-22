import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { ProductsModule } from '../products/products.module';
import { RestaurantAccessService } from '../restaurant-common/restaurant-access.service';
import { RestaurantTablesModule } from '../restaurant-tables/restaurant-tables.module';
import { UsersModule } from '../users/users.module';
import { PublicRestaurantOrdersController } from './public-restaurant-orders.controller';
import { RestaurantOrdersController } from './restaurant-orders.controller';
import { RestaurantOrdersService } from './restaurant-orders.service';
import {
  RestaurantOrder,
  RestaurantOrderSchema,
} from './schemas/restaurant-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RestaurantOrder.name, schema: RestaurantOrderSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    BusinessesModule,
    ProductsModule,
    RestaurantTablesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [RestaurantOrdersController, PublicRestaurantOrdersController],
  providers: [RestaurantOrdersService, RestaurantAccessService],
})
export class RestaurantOrdersModule {}
