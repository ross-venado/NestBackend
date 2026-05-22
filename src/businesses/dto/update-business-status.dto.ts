import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BusinessStatus } from '../../common/enums/business-status.enum';
import { PlanCode } from '../../common/enums/plan-code.enum';

export class UpdateBusinessStatusDto {
  @ApiPropertyOptional({ enum: BusinessStatus, example: BusinessStatus.Active })
  @IsOptional()
  @IsEnum(BusinessStatus)
  status?: BusinessStatus;

  @ApiPropertyOptional({ enum: PlanCode, example: PlanCode.Basic })
  @IsOptional()
  @IsEnum(PlanCode)
  plan?: PlanCode;
}
