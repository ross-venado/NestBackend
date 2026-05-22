import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BusinessCategoriesService } from './business-categories.service';
import { CreateBusinessCategoryDto } from './dto/create-business-category.dto';
import { UpdateBusinessCategoryDto } from './dto/update-business-category.dto';

@ApiTags('Admin categories')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('admin/categories')
export class AdminBusinessCategoriesController {
  constructor(private readonly categoriesService: BusinessCategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  create(@Body() data: CreateBusinessCategoryDto) {
    return this.categoriesService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateBusinessCategoryDto) {
    return this.categoriesService.update(id, data);
  }
}
