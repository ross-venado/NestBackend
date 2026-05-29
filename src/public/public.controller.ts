import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BusinessesService } from '../businesses/businesses.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { ProductsService } from '../products/products.service';
import { ServicesService } from '../services/services.service';
import { AnalyticsService } from '../analytics/analytics.service';

@ApiTags('Public marketplace')
@Controller('public')
export class PublicController {
  constructor(
    private readonly businessesService: BusinessesService,
    private readonly categoriesService: BusinessCategoriesService,
    private readonly productsService: ProductsService,
    private readonly servicesService: ServicesService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('businesses')
  businesses() {
    return this.businessesService.findPublic();
  }

  @Get('businesses/:slug')
  async business(@Param('slug') slug: string) {
    const business = await this.businessesService.findPublicBySlug(slug);
    void this.analyticsService
      .track(business._id, 'business_view', {
        source: 'public_business_page',
        slug,
      })
      .catch(() => undefined);

    return business;
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
