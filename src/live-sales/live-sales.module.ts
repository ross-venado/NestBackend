import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { UsersModule } from '../users/users.module';
import { LiveSalesController } from './live-sales.controller';
import { LiveSalesService } from './live-sales.service';
import { PublicLiveSalesController } from './public-live-sales.controller';
import { LiveLead, LiveLeadSchema } from './schemas/live-lead.schema';
import {
  LiveSession,
  LiveSessionSchema,
} from './schemas/live-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LiveSession.name, schema: LiveSessionSchema },
      { name: LiveLead.name, schema: LiveLeadSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    BusinessesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [LiveSalesController, PublicLiveSalesController],
  providers: [LiveSalesService],
})
export class LiveSalesModule {}
