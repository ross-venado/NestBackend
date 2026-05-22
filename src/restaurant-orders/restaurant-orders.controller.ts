import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RestaurantOrderStatus } from '../common/enums/restaurant-order-status.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { CreateRestaurantOrderDto } from './dto/create-restaurant-order.dto';
import { UpdateRestaurantOrderStatusDto } from './dto/update-restaurant-order-status.dto';
import { RestaurantOrdersService } from './restaurant-orders.service';

@ApiTags('Business restaurant orders')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.BusinessOwner, UserRole.Admin)
@Controller('business/restaurant/orders')
export class RestaurantOrdersController {
  constructor(private readonly ordersService: RestaurantOrdersService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateRestaurantOrderDto,
  ) {
    return this.ordersService.createForOwner(request.user._id, data);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: RestaurantOrderStatus })
  findAll(
    @Req() request: AuthenticatedRequest,
    @Query('status') status?: RestaurantOrderStatus,
  ) {
    return this.ordersService.findByOwner(request.user._id, status);
  }

  @Get(':id')
  findOne(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.ordersService.findOneForOwner(request.user._id, id);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateRestaurantOrderStatusDto,
  ) {
    return this.ordersService.updateStatusForOwner(request.user._id, id, data);
  }

  @Delete(':id')
  delete(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.ordersService.deleteForOwner(request.user._id, id);
  }
}
