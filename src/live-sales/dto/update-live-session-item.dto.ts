import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { LiveSessionItemStatus } from '../../common/enums/live-session-item-status.enum';

export class UpdateLiveSessionItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(8)
  code?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockOverride?: number;

  @IsOptional()
  @IsEnum(LiveSessionItemStatus)
  status?: LiveSessionItemStatus;
}
