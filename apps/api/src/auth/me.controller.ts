import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { PermissionsService } from './permissions.service';

@ApiTags('Current User Authorization')
@Controller('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('roles')
  @ApiOperation({ summary: 'List roles assigned to current authenticated user' })
  async getMyRoles(@CurrentUser('id') userId: string) {
    const roles = await this.permissionsService.getUserRoles(userId);
    return {
      userId,
      roles
    };
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get current user effective permissions after combining roles and overrides' })
  async getMyPermissions(@CurrentUser('id') userId: string) {
    const data = await this.permissionsService.getUserEffectivePermissions(userId);
    return {
      userId,
      isSuperAdmin: data.isSuperAdmin,
      permissions: data.permissions,
      overrides: data.overrides
    };
  }

  @Get('dashboard-access')
  @ApiOperation({ summary: 'Get accessible dashboard modules and section pages' })
  async getMyDashboardAccess(@CurrentUser('id') userId: string) {
    const modules = await this.permissionsService.getAccessibleDashboard(userId);
    return {
      userId,
      modules
    };
  }
}
