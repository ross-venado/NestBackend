import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { BusinessesService } from './businesses.service';
import { UpdateBusinessDto } from './dto/update-business.dto';

@ApiTags('Business panel')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.BusinessOwner, UserRole.Admin)
@Controller('business')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get('me')
  findMe(@Req() request: AuthenticatedRequest) {
    return this.businessesService.findByOwner(request.user._id);
  }

  @Patch('me')
  updateMe(
    @Req() request: AuthenticatedRequest,
    @Body() data: UpdateBusinessDto,
  ) {
    return this.businessesService.upsertOwnerBusiness(request.user._id, data);
  }
}
