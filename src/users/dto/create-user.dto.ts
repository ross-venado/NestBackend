import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Ernest Garcia' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'dueno@mercadito.test' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.BusinessOwner })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
