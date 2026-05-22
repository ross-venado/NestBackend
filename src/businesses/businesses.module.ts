import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Business, BusinessSchema } from './schemas/business.schema';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { AdminBusinessesController } from './admin-businesses.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [BusinessesController, AdminBusinessesController],
  providers: [BusinessesService],
  exports: [BusinessesService, MongooseModule],
})
export class BusinessesModule {}
