import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from './schemas/subscription-plan.schema';
import { AdminSubscriptionPlansController } from './admin-subscription-plans.controller';
import { SubscriptionPlansService } from './subscription-plans.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AdminSubscriptionPlansController],
  providers: [SubscriptionPlansService],
  exports: [SubscriptionPlansService, MongooseModule],
})
export class SubscriptionPlansModule {}
