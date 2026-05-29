import { Module } from '@nestjs/common';
import { BusinessesModule } from '../businesses/businesses.module';
import { BusinessCategoriesModule } from '../business-categories/business-categories.module';
import { ProductsModule } from '../products/products.module';
import { ServicesModule } from '../services/services.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { PublicController } from './public.controller';

@Module({
  imports: [
    BusinessesModule,
    BusinessCategoriesModule,
    ProductsModule,
    ServicesModule,
    AnalyticsModule,
  ],
  controllers: [PublicController],
})
export class PublicModule {}
