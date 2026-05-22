import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import {
  SubscriptionPlan,
  SubscriptionPlanDocument,
} from './schemas/subscription-plan.schema';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private planModel: Model<SubscriptionPlanDocument>,
  ) {}

  findAll() {
    return this.planModel.find().sort({ price: 1 }).exec();
  }

  create(data: CreateSubscriptionPlanDto) {
    return this.planModel.create(data);
  }

  async update(id: string, data: UpdateSubscriptionPlanDto) {
    const plan = await this.planModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return plan;
  }
}
