import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { AddLiveSessionItemDto } from './dto/add-live-session-item.dto';
import { CreateLiveSessionDto } from './dto/create-live-session.dto';
import { SetCurrentLiveProductDto } from './dto/set-current-live-product.dto';
import { UpdateLiveSessionItemDto } from './dto/update-live-session-item.dto';
import { UpdateLiveSessionDto } from './dto/update-live-session.dto';
import { LiveSalesService } from './live-sales.service';

@ApiTags('Business live sales')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.BusinessOwner, UserRole.Admin)
@Controller('business/live-sessions')
export class LiveSalesController {
  constructor(private readonly liveSalesService: LiveSalesService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.liveSalesService.findByOwner(request.user._id);
  }

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateLiveSessionDto,
  ) {
    return this.liveSalesService.createForOwner(request.user._id, data);
  }

  @Get(':id')
  findOne(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.liveSalesService.findOneForOwner(request.user._id, id);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateLiveSessionDto,
  ) {
    return this.liveSalesService.updateForOwner(request.user._id, id, data);
  }

  @Post(':id/items')
  addItem(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: AddLiveSessionItemDto,
  ) {
    return this.liveSalesService.addItemForOwner(request.user._id, id, data);
  }

  @Patch(':id/items/:productId')
  updateItem(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('productId') productId: string,
    @Body() data: UpdateLiveSessionItemDto,
  ) {
    return this.liveSalesService.updateItemForOwner(
      request.user._id,
      id,
      productId,
      data,
    );
  }

  @Post(':id/current-product')
  setCurrent(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: SetCurrentLiveProductDto,
  ) {
    return this.liveSalesService.setCurrentProductForOwner(
      request.user._id,
      id,
      data.productId,
    );
  }

  @Get(':id/leads')
  findLeads(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.liveSalesService.findLeadsForOwner(request.user._id, id);
  }
}
