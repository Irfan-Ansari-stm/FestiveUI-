import { Controller, Get, Patch, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Super Admin Operations')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'High-level admin dashboard analytics & counters' })
  getDashboard() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('users')
  @ApiOperation({ summary: 'Paginated user management list with search' })
  getUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string
  ) {
    return this.adminService.getUsers(Number(page) || 1, Number(limit) || 20, search);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Change user role' })
  updateRole(
    @CurrentUser('id') adminUserId: string,
    @Param('id') userId: string,
    @Body('role') role: string
  ) {
    return this.adminService.updateUserRole(adminUserId, userId, role);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user account status (ACTIVE/SUSPENDED)' })
  updateStatus(
    @CurrentUser('id') adminUserId: string,
    @Param('id') userId: string,
    @Body('status') status: string
  ) {
    return this.adminService.updateUserStatus(adminUserId, userId, status);
  }

  @Get('animations')
  @ApiOperation({ summary: 'List all animations in all states (Draft, Review, Published)' })
  getAdminAnimations() {
    return this.adminService.getAdminAnimations();
  }

  @Post('animations/:id/publish')
  @ApiOperation({ summary: 'Toggle animation publication state' })
  publishAnimation(
    @CurrentUser('id') adminUserId: string,
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.adminService.togglePublishAnimation(adminUserId, id, status || 'PUBLISHED');
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get administrative audit trail logs' })
  getAuditLogs(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getAuditLogs(Number(page) || 1, Number(limit) || 50);
  }
}
