import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Super Admin Control Panel')
@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 1. Overview & Stats
  @Get('stats')
  @RequirePermissions('overview.view')
  @ApiOperation({ summary: 'High-level dashboard KPIs and trends' })
  getStats() {
    return this.adminService.getDashboardMetrics();
  }

  // 2. Roles
  @Get('roles')
  @RequirePermissions('roles.view')
  @ApiOperation({ summary: 'List all platform roles' })
  getRoles() {
    return this.adminService.getRoles();
  }

  @Post('roles')
  @RequirePermissions('roles.create')
  @ApiOperation({ summary: 'Create new custom role' })
  createRole(
    @CurrentUser('id') adminUserId: string,
    @Body() body: { name: string; slug: string; description?: string }
  ) {
    return this.adminService.createRole(adminUserId, body);
  }

  @Get('roles/:id')
  @RequirePermissions('roles.view')
  @ApiOperation({ summary: 'Get role details with permissions and users' })
  getRoleById(@Param('id') id: string) {
    return this.adminService.getRoleById(id);
  }

  @Patch('roles/:id')
  @RequirePermissions('roles.update')
  @ApiOperation({ summary: 'Update role metadata' })
  updateRole(
    @CurrentUser('id') adminUserId: string,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; status?: string }
  ) {
    return this.adminService.updateRole(adminUserId, id, body);
  }

  @Delete('roles/:id')
  @RequirePermissions('roles.delete')
  @ApiOperation({ summary: 'Delete custom role' })
  deleteRole(@CurrentUser('id') adminUserId: string, @Param('id') id: string) {
    return this.adminService.deleteRole(adminUserId, id);
  }

  @Post('roles/:id/duplicate')
  @RequirePermissions('roles.duplicate')
  @ApiOperation({ summary: 'Clone existing role with its permission set' })
  duplicateRole(
    @CurrentUser('id') adminUserId: string,
    @Param('id') id: string,
    @Body('name') newName?: string
  ) {
    return this.adminService.duplicateRole(adminUserId, id, newName);
  }

  // 3. Permissions Matrix
  @Get('permissions')
  @RequirePermissions('permissions.view')
  @ApiOperation({ summary: 'List all permission definitions grouped by module' })
  getPermissions() {
    return this.adminService.getAllPermissions();
  }

  @Get('roles/:id/permissions')
  @RequirePermissions('roles.view')
  @ApiOperation({ summary: 'Get assigned permissions for a specific role' })
  getRolePermissions(@Param('id') id: string) {
    return this.adminService.getRolePermissions(id);
  }

  @Put('roles/:id/permissions')
  @RequirePermissions('roles.assign_permissions')
  @ApiOperation({ summary: 'Batch update permission matrix for a role' })
  updateRolePermissions(
    @CurrentUser('id') adminUserId: string,
    @Param('id') id: string,
    @Body('permissions') permissions: { permissionSlug: string; effect: 'ALLOW' | 'DENY' }[]
  ) {
    return this.adminService.updateRolePermissions(adminUserId, id, permissions || []);
  }

  // 4. Users
  @Get('users')
  @RequirePermissions('users.view')
  @ApiOperation({ summary: 'Search and filter users with pagination' })
  getUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('role') role: string,
    @Query('status') status: string
  ) {
    return this.adminService.getUsers(Number(page) || 1, Number(limit) || 20, search, role, status);
  }

  @Get('users/:id')
  @RequirePermissions('users.details.view')
  @ApiOperation({ summary: 'Get user details with projects, purchases and roles' })
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Get('users/:id/roles')
  @RequirePermissions('roles.view')
  @ApiOperation({ summary: 'Get roles assigned to user' })
  async getUserRoles(@Param('id') id: string) {
    const user: any = await this.adminService.getUserById(id);
    return user.userRoles;
  }

  @Post('users/:id/roles')
  @RequirePermissions('roles.assign_users')
  @ApiOperation({ summary: 'Assign role to user' })
  assignUserRole(
    @CurrentUser('id') adminUserId: string,
    @Param('id') userId: string,
    @Body('roleId') roleId: string
  ) {
    return this.adminService.assignUserRole(adminUserId, userId, roleId);
  }

  @Delete('users/:id/roles/:roleId')
  @RequirePermissions('roles.assign_users')
  @ApiOperation({ summary: 'Remove assigned role from user' })
  removeUserRole(
    @CurrentUser('id') adminUserId: string,
    @Param('id') userId: string,
    @Param('roleId') roleId: string
  ) {
    return this.adminService.removeUserRole(adminUserId, userId, roleId);
  }

  @Patch('users/:id/status')
  @RequirePermissions('users.suspend')
  @ApiOperation({ summary: 'Update user account status (ACTIVE, SUSPENDED, BLOCKED)' })
  updateUserStatus(
    @CurrentUser('id') adminUserId: string,
    @Param('id') userId: string,
    @Body('status') status: string,
    @Body('reason') reason?: string
  ) {
    return this.adminService.updateUserStatus(adminUserId, userId, status, reason);
  }

  // 5. Dashboard Access Control
  @Get('dashboard-modules')
  @RequirePermissions('dashboard_access.view')
  @ApiOperation({ summary: 'Get hierarchical dashboard modules & section tree' })
  getDashboardModules() {
    return this.adminService.getDashboardModules();
  }

  @Get('roles/:id/dashboard-access')
  @RequirePermissions('dashboard_access.view')
  @ApiOperation({ summary: 'Get allowed dashboard sections for a role' })
  getRoleDashboardAccess(@Param('id') roleId: string) {
    return this.adminService.getRoleDashboardAccess(roleId);
  }

  @Put('roles/:id/dashboard-access')
  @RequirePermissions('dashboard_access.update')
  @ApiOperation({ summary: 'Update section visibility for a role' })
  updateRoleDashboardAccess(
    @CurrentUser('id') adminUserId: string,
    @Param('id') roleId: string,
    @Body('access') access: { moduleId?: string; pageId?: string; isAllowed: boolean }[]
  ) {
    return this.adminService.updateRoleDashboardAccess(adminUserId, roleId, access || []);
  }

  // 6. Developers
  @Get('developers')
  @RequirePermissions('developers.view')
  @ApiOperation({ summary: 'List registered developer accounts' })
  getDevelopers(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getDevelopers(Number(page) || 1, Number(limit) || 20);
  }

  // 7. Projects
  @Get('projects')
  @RequirePermissions('projects.view')
  @ApiOperation({ summary: 'List developer registered websites' })
  getProjects(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getProjects(Number(page) || 1, Number(limit) || 20);
  }

  // 8. Festivals
  @Get('festivals')
  @RequirePermissions('festivals.view')
  @ApiOperation({ summary: 'List cultural festivals' })
  getFestivals() {
    return this.adminService.getFestivals();
  }

  @Post('festivals')
  @RequirePermissions('festivals.create')
  @ApiOperation({ summary: 'Create cultural festival' })
  createFestival(@CurrentUser('id') adminUserId: string, @Body() body: any) {
    return this.adminService.createFestival(adminUserId, body);
  }

  @Patch('festivals/:id')
  @RequirePermissions('festivals.update')
  @ApiOperation({ summary: 'Update cultural festival' })
  updateFestival(@CurrentUser('id') adminUserId: string, @Param('id') id: string, @Body() body: any) {
    return this.adminService.updateFestival(adminUserId, id, body);
  }

  @Delete('festivals/:id')
  @RequirePermissions('festivals.delete')
  @ApiOperation({ summary: 'Delete cultural festival' })
  deleteFestival(@CurrentUser('id') adminUserId: string, @Param('id') id: string) {
    return this.adminService.deleteFestival(adminUserId, id);
  }

  // 9. Animations
  @Get('animations')
  @RequirePermissions('animations.view')
  @ApiOperation({ summary: 'List all animations' })
  getAdminAnimations() {
    return this.adminService.getAdminAnimations();
  }

  @Post('animations/:id/publish')
  @RequirePermissions('animations.publish')
  @ApiOperation({ summary: 'Toggle animation publication state' })
  publishAnimation(
    @CurrentUser('id') adminUserId: string,
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.adminService.togglePublishAnimation(adminUserId, id, status || 'PUBLISHED');
  }

  // 10. Subscriptions & Payments
  @Get('subscriptions')
  @RequirePermissions('subscriptions.view')
  @ApiOperation({ summary: 'List active subscriptions and tier plans' })
  getSubscriptions() {
    return this.adminService.getSubscriptions();
  }

  @Get('payments')
  @RequirePermissions('payments.view')
  @ApiOperation({ summary: 'List payments and transaction records' })
  getPayments(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getPayments(Number(page) || 1, Number(limit) || 20);
  }

  @Post('payments/:id/refund')
  @RequirePermissions('payments.refund')
  @ApiOperation({ summary: 'Issue order refund' })
  refundPayment(
    @CurrentUser('id') adminUserId: string,
    @Param('id') id: string,
    @Body('reason') reason?: string
  ) {
    return this.adminService.refundPayment(adminUserId, id, reason);
  }

  // 11. Licenses
  @Get('licenses')
  @RequirePermissions('licenses.view')
  @ApiOperation({ summary: 'List software licenses' })
  getLicenses() {
    return this.adminService.getLicenses();
  }

  @Post('licenses/:id/revoke')
  @RequirePermissions('licenses.revoke')
  @ApiOperation({ summary: 'Revoke active license' })
  revokeLicense(
    @CurrentUser('id') adminUserId: string,
    @Param('id') id: string,
    @Body('reason') reason?: string
  ) {
    return this.adminService.revokeLicense(adminUserId, id, reason);
  }

  // 12. API Management
  @Get('api-management')
  @RequirePermissions('api.view')
  @ApiOperation({ summary: 'List API keys and telemetry logs' })
  getApiManagement() {
    return this.adminService.getApiManagement();
  }

  // 13. Audit Logs
  @Get('audit-logs')
  @RequirePermissions('audit_logs.view')
  @ApiOperation({ summary: 'Administrative audit trail with filters' })
  getAuditLogs(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('action') action: string
  ) {
    return this.adminService.getAuditLogs(Number(page) || 1, Number(limit) || 50, action);
  }

  // 14. System Settings
  @Get('settings')
  @RequirePermissions('settings.view')
  @ApiOperation({ summary: 'Get platform environment and security configuration' })
  getSettings() {
    return this.adminService.getSettings();
  }
}
