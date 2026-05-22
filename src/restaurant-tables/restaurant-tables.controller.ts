import {
  Body,
  Controller,
  Delete,
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
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { RestaurantTablesService } from './restaurant-tables.service';

@ApiTags('Business restaurant tables')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.BusinessOwner, UserRole.Admin)
@Controller('business/restaurant/tables')
export class RestaurantTablesController {
  constructor(private readonly tablesService: RestaurantTablesService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateRestaurantTableDto,
  ) {
    return this.tablesService.createForOwner(request.user._id, data);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.tablesService.findByOwner(request.user._id);
  }

  @Get(':id')
  findOne(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.tablesService.findOneForOwner(request.user._id, id);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateRestaurantTableDto,
  ) {
    return this.tablesService.updateForOwner(request.user._id, id, data);
  }

  @Delete(':id')
  delete(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.tablesService.deleteForOwner(request.user._id, id);
  }
}
