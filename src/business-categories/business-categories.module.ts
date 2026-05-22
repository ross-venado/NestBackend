import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import {
  BusinessCategory,
  BusinessCategorySchema,
} from './schemas/business-category.schema';
import { BusinessCategoriesService } from './business-categories.service';
import { AdminBusinessCategoriesController } from './admin-business-categories.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessCategory.name, schema: BusinessCategorySchema },
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AdminBusinessCategoriesController],
  providers: [BusinessCategoriesService],
  exports: [BusinessCategoriesService, MongooseModule],
})
export class BusinessCategoriesModule {}
