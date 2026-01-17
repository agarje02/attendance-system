import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  email: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
