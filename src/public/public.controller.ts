import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BusinessesService } from '../businesses/businesses.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { ProductsService } from '../products/products.service';
import { ServicesService } from '../services/services.service';

@ApiTags('Public marketplace')
@Controller('public')
export class PublicController {
  constructor(
    private readonly businessesService: BusinessesService,
    private readonly categoriesService: BusinessCategoriesService,
    private readonly productsService: ProductsService,
    private readonly servicesService: ServicesService,
  ) {}

  @Get('businesses')
  businesses() {
    return this.businessesService.findPublic();
  }

  @Get('businesses/:slug')
  business(@Param('slug') slug: string) {
    return this.businessesService.findPublicBySlug(slug);
  }

  @Get('categories')
  categories() {
    return this.categoriesService.findPublic();
  }

  @Get('businesses/:slug/products')
  products(@Param('slug') slug: string) {
    return this.productsService.findPublicByBusinessSlug(slug);
  }

  @Get('businesses/:slug/services')
  services(@Param('slug') slug: string) {
    return this.servicesService.findPublicByBusinessSlug(slug);
  }
}
