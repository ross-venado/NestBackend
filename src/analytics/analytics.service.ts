import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AnalyticsEvent,
  AnalyticsEventDocument,
} from './schemas/analytics-event.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(AnalyticsEvent.name)
    private eventModel: Model<AnalyticsEventDocument>,
  ) {}

  track(
    businessId: string | Types.ObjectId,
    type: string,
    metadata: Record<string, unknown> = {},
  ) {
    return this.eventModel.create({ businessId, type, metadata });
  }

  async businessSummary(businessId: string | Types.ObjectId) {
    return this.eventModel
      .aggregate([
        { $match: { businessId: new Types.ObjectId(businessId.toString()) } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ])
      .exec();
  }
}
