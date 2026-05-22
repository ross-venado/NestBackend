import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BusinessesService } from '../businesses/businesses.service';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.BusinessOwner, UserRole.Admin)
@Controller('business/analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly businessesService: BusinessesService,
  ) {}

  @Get('summary')
  async summary(@Req() request: AuthenticatedRequest) {
    const business = await this.businessesService.findByOwner(request.user._id);
    return this.analyticsService.businessSummary(business._id);
  }

  @Post('events')
  async track(
    @Req() request: AuthenticatedRequest,
    @Body() data: TrackEventDto,
  ) {
    const business = await this.businessesService.findByOwner(request.user._id);
    return this.analyticsService.track(business._id, data.type, data.metadata);
  }
}
