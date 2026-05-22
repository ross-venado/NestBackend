import { ForbiddenException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BusinessesService } from '../businesses/businesses.service';
import { BusinessModule } from '../common/enums/business-module.enum';

@Injectable()
export class RestaurantAccessService {
  constructor(private readonly businessesService: BusinessesService) {}

  async getOwnerRestaurantBusiness(ownerId: string | Types.ObjectId) {
    const business = await this.businessesService.findByOwner(ownerId);
    if (!business.modules?.includes(BusinessModule.Restaurant)) {
      throw new ForbiddenException(
        'Restaurant module is not active for this business',
      );
    }

    return business;
  }

  async getPublicRestaurantBusiness(slug: string) {
    const business = await this.businessesService.findPublicBySlug(slug);
    if (!business.modules?.includes(BusinessModule.Restaurant)) {
      throw new ForbiddenException(
        'Restaurant module is not active for this business',
      );
    }

    return business;
  }
}
