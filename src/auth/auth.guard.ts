import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import responseHelper from 'src/helper/response-helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException(responseHelper.error('Token not found'));
    }
    const token = authorization && authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        responseHelper.error('Invalid Token Formate'),
      );
    }
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!decoded) {
        throw new UnauthorizedException(responseHelper.error('Invalid token'));
      }
      const user = await this.prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          contact: true,
          about: true,
          role: true,
        },
      });
      if (!user) {
        throw new UnauthorizedException(responseHelper.error('NOT found'));
      }
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(responseHelper.error(error.message));
    }
  }
}
