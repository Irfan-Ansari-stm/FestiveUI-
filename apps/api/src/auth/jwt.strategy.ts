import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    if (!user || user.status === 'SUSPENDED' || user.deletedAt) {
      throw new UnauthorizedException('User account inactive or suspended');
    }

    return {
      id: user.id,
      email: user.email,
      roles: user.userRoles.map((ur) => ur.role.name),
      profile: user.profile
    };
  }
}
