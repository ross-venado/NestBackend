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
import { BusinessCatalogCategoriesService } from './business-catalog-categories.service';
import { CreateBusinessCatalogCategoryDto } from './dto/create-business-catalog-category.dto';
import { UpdateBusinessCatalogCategoryDto } from './dto/update-business-catalog-category.dto';

@ApiTags('Business catalog categories')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.BusinessOwner, UserRole.Admin)
@Controller('business/catalog-categories')
export class BusinessCatalogCategoriesController {
  constructor(
    private readonly categoriesService: BusinessCatalogCategoriesService,
  ) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.categoriesService.findByOwner(request.user._id);
  }

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateBusinessCatalogCategoryDto,
  ) {
    return this.categoriesService.createForOwner(request.user._id, data);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateBusinessCatalogCategoryDto,
  ) {
    return this.categoriesService.updateForOwner(request.user._id, id, data);
  }

  @Delete(':id')
  delete(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.categoriesService.deleteForOwner(request.user._id, id);
  }
}
