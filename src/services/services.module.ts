import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { UsersModule } from '../users/users.module';
import { Service, ServiceSchema } from './schemas/service.schema';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
    BusinessesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService, MongooseModule],
})
export class ServicesModule {}
