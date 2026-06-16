import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { BusinessCategoriesModule } from './business-categories/business-categories.module';
import { BusinessCatalogCategoriesModule } from './business-catalog-categories/business-catalog-categories.module';
import { ServicesModule } from './services/services.module';
import { SubscriptionPlansModule } from './subscription-plans/subscription-plans.module';
import { QrModule } from './qr/qr.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PublicModule } from './public/public.module';
import { RestaurantTablesModule } from './restaurant-tables/restaurant-tables.module';
import { RestaurantOrdersModule } from './restaurant-orders/restaurant-orders.module';
import { LiveSalesModule } from './live-sales/live-sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://localhost:27017/mercadito_chimalteco',
    ),
    UsersModule,
    AuthModule,
    BusinessesModule,
    BusinessCategoriesModule,
    BusinessCatalogCategoriesModule,
    ProductsModule,
    ServicesModule,
    SubscriptionPlansModule,
    QrModule,
    AnalyticsModule,
    PublicModule,
    RestaurantTablesModule,
    RestaurantOrdersModule,
    LiveSalesModule,
  ],
})
export class AppModule {}
