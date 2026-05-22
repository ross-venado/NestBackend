import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { UsersModule } from '../users/users.module';
import { RestaurantAccessService } from '../restaurant-common/restaurant-access.service';
import { RestaurantTablesController } from './restaurant-tables.controller';
import { RestaurantTablesService } from './restaurant-tables.service';
import {
  RestaurantTable,
  RestaurantTableSchema,
} from './schemas/restaurant-table.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RestaurantTable.name, schema: RestaurantTableSchema },
    ]),
    BusinessesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [RestaurantTablesController],
  providers: [RestaurantTablesService, RestaurantAccessService],
  exports: [RestaurantTablesService, MongooseModule],
})
export class RestaurantTablesModule {}
