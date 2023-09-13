// middleware/attach-user.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface ExtendedRequest extends Request {
  user?: any; // Define the user property here, or specify a more detailed type if you have one.
}

@Injectable()
export class AttachUserMiddleware implements NestMiddleware {
  use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.AUTH0_CLIENT_SECRET);
        req.user = decoded;
      } catch (err) {
        console.error('Error decoding token', err);
      }
    }
    next();
  }
}
