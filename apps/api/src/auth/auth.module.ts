import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { MeController } from './me.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsService } from './permissions.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({})
  ],
  controllers: [AuthController, MeController],
  providers: [AuthService, JwtStrategy, RolesGuard, PermissionsService, PermissionsGuard, SuperAdminGuard],
  exports: [AuthService, JwtStrategy, RolesGuard, PermissionsService, PermissionsGuard, SuperAdminGuard, PassportModule]
})
export class AuthModule {}
