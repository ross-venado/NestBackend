import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { LiveSessionStatus } from '../../common/enums/live-session-status.enum';

export class UpdateLiveSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(90)
  title?: string;

  @IsOptional()
  @IsEnum(LiveSessionStatus)
  status?: LiveSessionStatus;
}
