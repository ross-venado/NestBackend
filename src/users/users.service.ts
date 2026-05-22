import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createHash, pbkdf2Sync, randomBytes } from 'crypto';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: CreateUserDto): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: data.email }).exec();
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordSalt = randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(data.password, passwordSalt);

    return this.userModel.create({
      name: data.name,
      email: data.email,
      passwordHash,
      passwordSalt,
      role: data.role || UserRole.BusinessOwner,
    });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase(), active: true })
      .exec();
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user || !user.active) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  verifyPassword(user: UserDocument, password: string): boolean {
    return user.passwordHash === this.hashPassword(password, user.passwordSalt);
  }

  sanitize(user: UserDocument) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  private hashPassword(password: string, salt: string): string {
    return createHash('sha256')
      .update(pbkdf2Sync(password, salt, 120000, 32, 'sha256'))
      .digest('hex');
  }
}
