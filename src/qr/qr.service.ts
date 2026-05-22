import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildBusinessPublicUrl } from '../common/utils/public-url.util';

@Injectable()
export class QrService {
  constructor(private readonly configService: ConfigService) {}

  buildBusinessQrPayload(slug: string) {
    const publicUrl = buildBusinessPublicUrl(
      this.configService.get<string>('APP_PUBLIC_URL') ||
        'http://localhost:3000',
      slug,
    );

    return {
      type: 'business_url',
      value: publicUrl,
    };
  }
}
