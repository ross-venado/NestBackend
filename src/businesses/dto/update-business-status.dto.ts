import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { BusinessModule } from '../../common/enums/business-module.enum';
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

  @ApiPropertyOptional({
    enum: BusinessModule,
    isArray: true,
    example: [BusinessModule.Marketplace, BusinessModule.Restaurant],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(BusinessModule, { each: true })
  modules?: BusinessModule[];
}
