import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { SubscriptionPlansService } from './subscription-plans.service';

@ApiTags('Admin subscription plans')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('admin/subscription-plans')
export class AdminSubscriptionPlansController {
  constructor(private readonly plansService: SubscriptionPlansService) {}

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Post()
  create(@Body() data: CreateSubscriptionPlanDto) {
    return this.plansService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateSubscriptionPlanDto) {
    return this.plansService.update(id, data);
  }
}
