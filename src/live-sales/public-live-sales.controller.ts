import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLiveLeadDto } from './dto/create-live-lead.dto';
import { LiveSalesService } from './live-sales.service';

@ApiTags('Public live sales')
@Controller('public/live')
export class PublicLiveSalesController {
  constructor(private readonly liveSalesService: LiveSalesService) {}

  @Get(':businessSlug/:sessionSlug')
  findPublic(
    @Param('businessSlug') businessSlug: string,
    @Param('sessionSlug') sessionSlug: string,
  ) {
    return this.liveSalesService.findPublicSession(businessSlug, sessionSlug);
  }

  @Post(':businessSlug/:sessionSlug/leads')
  createLead(
    @Param('businessSlug') businessSlug: string,
    @Param('sessionSlug') sessionSlug: string,
    @Body() data: CreateLiveLeadDto,
  ) {
    return this.liveSalesService.createPublicLead(
      businessSlug,
      sessionSlug,
      data,
    );
  }
}
