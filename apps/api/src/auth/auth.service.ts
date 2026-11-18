import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ResetPasswordDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() }
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const devRole = await this.prisma.role.findUnique({
      where: { name: 'DEVELOPER' }
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        emailVerified: true, // Auto-verify for onboarding ease
        status: 'ACTIVE',
        profile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            company: dto.company
          }
        },
        userRoles: devRole
          ? {
              create: {
                roleId: devRole.id
              }
            }
          : undefined
      },
      include: {
        profile: true,
        userRoles: { include: { role: true } }
      }
    });

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
        roles: user.userRoles.map((ur) => ur.role.name)
      },
      ...tokens
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        profile: true,
        userRoles: { include: { role: true } }
      }
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Account has been suspended. Please contact support.');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
        roles: user.userRoles.map((ur) => ur.role.name)
      },
      ...tokens
    };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'festiveui_super_secret_jwt_refresh_key_2026'
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access denied');
    }

    const isMatch = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null }
    });
    return { success: true, message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    if (!user) {
      return { success: true, message: 'If the email exists, a reset link was sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });

    return {
      success: true,
      message: 'Reset instructions generated successfully.',
      resetToken // Returned for testing & dev convenience
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return { success: true, message: 'Password reset successfully' };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'festiveui_super_secret_jwt_access_key_2026',
        expiresIn: '15m'
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'festiveui_super_secret_jwt_refresh_key_2026',
        expiresIn: '7d'
      })
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 mins in seconds
    };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash }
    });
  }
}
