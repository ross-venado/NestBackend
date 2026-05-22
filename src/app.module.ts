import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { BusinessCategoriesModule } from './business-categories/business-categories.module';
import { ServicesModule } from './services/services.module';
import { SubscriptionPlansModule } from './subscription-plans/subscription-plans.module';
import { QrModule } from './qr/qr.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PublicModule } from './public/public.module';

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
    ProductsModule,
    ServicesModule,
    SubscriptionPlansModule,
    QrModule,
    AnalyticsModule,
    PublicModule,
  ],
})
export class AppModule {}
