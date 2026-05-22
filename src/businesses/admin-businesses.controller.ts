import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { BusinessesService } from './businesses.service';
import { UpdateBusinessStatusDto } from './dto/update-business-status.dto';

@ApiTags('Admin businesses')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('admin/businesses')
export class AdminBusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  findAll() {
    return this.businessesService.findAdmin();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() data: UpdateBusinessStatusDto) {
    return this.businessesService.updateStatus(id, data);
  }
}
