import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { UsersModule } from '../users/users.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import {
  AnalyticsEvent,
  AnalyticsEventSchema,
} from './schemas/analytics-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnalyticsEvent.name, schema: AnalyticsEventSchema },
    ]),
    BusinessesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService, MongooseModule],
})
export class AnalyticsModule {}
