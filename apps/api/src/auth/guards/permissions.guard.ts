import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { SUPER_ADMIN_KEY } from '../decorators/super-admin.decorator';
import { PermissionsService } from '../permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isSuperAdminRequired = this.reflector.getAllAndOverride<boolean>(SUPER_ADMIN_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    if (user.isSuperAdmin) {
      return true; // Super Admin has unrestricted access to everything
    }

    if (isSuperAdminRequired) {
      throw new ForbiddenException('Only the Super Admin platform owner can access this resource');
    }

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    for (const permission of requiredPermissions) {
      const allowed = await this.permissionsService.hasPermission(user.id, permission);
      if (!allowed) {
        throw new ForbiddenException(`Access denied. Missing required permission: ${permission}`);
      }
    }

    return true;
  }
}
