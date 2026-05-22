import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { AdminRole } from '../../common/enums/admin-role.enum';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class AdminRegisterDto extends PickType(CreateUserDto, [
  'name',
  'email',
  'password',
] as const) {
  @ApiProperty({ example: 'local-admin-setup-key' })
  @IsString()
  setupKey: string;

  @ApiProperty({ enum: AdminRole, example: AdminRole.Operations })
  @IsEnum(AdminRole)
  adminRole: AdminRole;
}
