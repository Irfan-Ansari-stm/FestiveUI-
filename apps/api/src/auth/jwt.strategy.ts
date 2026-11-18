import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'festiveui_super_secret_jwt_access_key_2026'
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        profile: true,
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User account does not exist or has been deleted');
    }

    if (user.status === 'SUSPENDED' || user.status === 'BLOCKED' || user.status === 'DEACTIVATED') {
      throw new ForbiddenException(`Account is ${user.status.toLowerCase()}. Access denied.`);
    }

    const roles = user.userRoles.map((ur) => ur.role.slug || ur.role.name.toLowerCase());
    const isSuperAdmin = user.userRoles.some((ur) => ur.role.isSuperAdmin || ur.role.slug === 'super_admin' || ur.role.name === 'SUPER_ADMIN');

    return {
      id: user.id,
      email: user.email,
      roles,
      roleNames: user.userRoles.map((ur) => ur.role.name),
      isSuperAdmin,
      profile: user.profile,
      status: user.status
    };
  }
}
