import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    try {
      if (err || !user) {
        throw new UnauthorizedException('Invalid or missing authentication token');
      }
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Authentication error:', error);
      throw new UnauthorizedException('Authentication failed due to an unexpected error');
    }
  }
}