import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { UsersModule } from '../users/users.module';
import { BusinessCatalogCategoriesController } from './business-catalog-categories.controller';
import { BusinessCatalogCategoriesService } from './business-catalog-categories.service';
import {
  BusinessCatalogCategory,
  BusinessCatalogCategorySchema,
} from './schemas/business-catalog-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BusinessCatalogCategory.name,
        schema: BusinessCatalogCategorySchema,
      },
    ]),
    BusinessesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [BusinessCatalogCategoriesController],
  providers: [BusinessCatalogCategoriesService],
  exports: [BusinessCatalogCategoriesService, MongooseModule],
})
export class BusinessCatalogCategoriesModule {}
