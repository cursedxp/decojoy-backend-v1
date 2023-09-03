import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user object exists
    if (!user) {
      throw new UnauthorizedException('No user found in request');
    }

    // Extract roles from the JWT's custom namespace
    const userRoles = user['https://www.decojoy.co/role'];

    // Error handling for missing roles in JWT
    if (!userRoles) {
      throw new ForbiddenException('User does not have any roles assigned');
    }

    // Check if user has at least one of the required roles
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    // If user doesn't have the required roles, throw a ForbiddenException
    if (!hasRole) {
      throw new ForbiddenException('User lacks the required roles');
    }

    return true;
  }
}
