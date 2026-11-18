import { SetMetadata } from '@nestjs/common';

export const SUPER_ADMIN_KEY = 'super_admin_only';
export const RequireSuperAdmin = () => SetMetadata(SUPER_ADMIN_KEY, true);
