import { Request } from 'express';
import { UserDocument } from '../../users/schemas/user.schema';

export type AuthenticatedRequest = Request & {
  user: UserDocument;
};
