import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLiveSessionDto {
  @IsString()
  @MaxLength(90)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}
