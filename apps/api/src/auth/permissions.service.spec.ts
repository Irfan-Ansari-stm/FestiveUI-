import { evaluateUserPermission } from '@festiveui/permissions';

describe('RBAC & Permission Matrix Evaluation Engine', () => {
  describe('Authoritative Permission Resolution Strategy', () => {
    it('grants full access when isSuperAdmin is true', () => {
      const allowed = evaluateUserPermission('system.security.wipe', [], [], true);
      expect(allowed).toBe(true);
    });

    it('grants access when role contains matching permission with ALLOW effect', () => {
      const permissions = [
        { slug: 'animations.create', effect: 'ALLOW' as const },
        { slug: 'festivals.view', effect: 'ALLOW' as const }
      ];
      expect(evaluateUserPermission('animations.create', permissions, [], false)).toBe(true);
      expect(evaluateUserPermission('festivals.view', permissions, [], false)).toBe(true);
      expect(evaluateUserPermission('payments.refund', permissions, [], false)).toBe(false);
    });

    it('enforces explicit DENY taking precedence over ALLOW across combined roles', () => {
      // User has Role A (which allows users.delete) and Role B (which explicitly denies users.delete)
      const combinedRolePermissions = [
        { slug: 'users.delete', effect: 'ALLOW' as const },
        { slug: 'users.delete', effect: 'DENY' as const }
      ];
      const allowed = evaluateUserPermission('users.delete', combinedRolePermissions, [], false);
      expect(allowed).toBe(false);
    });

    it('allows user-level overrides to override role-level grants', () => {
      const rolePermissions = [{ slug: 'animations.delete', effect: 'ALLOW' as const }];
      const userOverrides = [{ slug: 'animations.delete', effect: 'DENY' as const }];

      const allowed = evaluateUserPermission('animations.delete', rolePermissions, userOverrides, false);
      expect(allowed).toBe(false);
    });

    it('allows user-level explicit ALLOW override to grant access when role denies or lacks permission', () => {
      const rolePermissions: { slug: string; effect: 'ALLOW' | 'DENY' }[] = [];
      const userOverrides = [{ slug: 'payments.export', effect: 'ALLOW' as const }];

      const allowed = evaluateUserPermission('payments.export', rolePermissions, userOverrides, false);
      expect(allowed).toBe(true);
    });

    it('defaults to closed/denied model when permission is not defined', () => {
      const rolePermissions = [{ slug: 'overview.view', effect: 'ALLOW' as const }];
      expect(evaluateUserPermission('settings.update', rolePermissions, [], false)).toBe(false);
    });
  });
});
