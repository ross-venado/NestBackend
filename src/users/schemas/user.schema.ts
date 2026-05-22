import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AdminRole } from '../../common/enums/admin-role.enum';
import { BusinessRole } from '../../common/enums/business-role.enum';
import { UserRole } from '../../common/enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  passwordSalt: string;

  @Prop({ enum: UserRole, default: UserRole.BusinessOwner })
  role: UserRole;

  @Prop({ enum: AdminRole })
  adminRole?: AdminRole;

  @Prop({ enum: BusinessRole, default: BusinessRole.Owner })
  businessRole?: BusinessRole;

  @Prop({ default: true })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
