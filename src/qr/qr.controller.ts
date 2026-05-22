import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QrService } from './qr.service';

@ApiTags('QR')
@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get('businesses/:slug')
  businessQr(@Param('slug') slug: string) {
    return this.qrService.buildBusinessQrPayload(slug);
  }
}
