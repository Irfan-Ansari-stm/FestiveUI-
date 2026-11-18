/**
 * Enterprise Dynamic RBAC and Permission Definitions for FestiveUI
 */

export interface PermissionDefinition {
  slug: string;
  name: string;
  module: string;
  action: string;
  level: 1 | 2 | 3 | 4 | 5; // 1: Module, 2: Page, 3: Action, 4: Component, 5: Data
  description: string;
}

export interface PermissionGroup {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface DashboardPageNode {
  slug: string;
  name: string;
  route: string;
  icon?: string;
  permissionSlug: string;
  sortOrder: number;
  actions?: {
    name: string;
    permissionSlug: string;
  }[];
  children?: DashboardPageNode[];
}

export interface DashboardModuleNode {
  slug: string;
  name: string;
  icon: string;
  route: string;
  sortOrder: number;
  permissionSlug: string;
  pages: DashboardPageNode[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  { slug: 'overview', name: 'Overview & Dashboard', description: 'Access to system overview metrics and dashboard charts', sortOrder: 1 },
  { slug: 'users', name: 'User Management', description: 'Manage user accounts, statuses, suspensions, and profiles', sortOrder: 2 },
  { slug: 'roles', name: 'Role Management', description: 'Create, edit, duplicate, and configure custom RBAC roles', sortOrder: 3 },
  { slug: 'permissions', name: 'Permission Matrix', description: 'View and assign fine-grained permissions across all 5 levels', sortOrder: 4 },
  { slug: 'dashboard_access', name: 'Dashboard Access Control', description: 'Hierarchical visibility and authorization of dashboard sections', sortOrder: 5 },
  { slug: 'developers', name: 'Developer Management', description: 'Manage developer profiles, projects, and developer keys', sortOrder: 6 },
  { slug: 'projects', name: 'Website Projects', description: 'Review, configure, and audit registered website projects', sortOrder: 7 },
  { slug: 'festivals', name: 'Festival Management', description: 'Create and configure cultural festivals, themes, and dates', sortOrder: 8 },
  { slug: 'animations', name: 'Animation Management', description: 'Full animation lifecycle, schemas, assets, and approvals', sortOrder: 9 },
  { slug: 'marketplace', name: 'Marketplace Management', description: 'Control marketplace listings, featured items, and reviews', sortOrder: 10 },
  { slug: 'subscriptions', name: 'Subscription Management', description: 'Manage tiers, pricing, quotas, and active developer subscriptions', sortOrder: 11 },
  { slug: 'payments', name: 'Payment Management', description: 'Track transactions, invoices, disputes, and issue refunds', sortOrder: 12 },
  { slug: 'licenses', name: 'License Management', description: 'Generate, bind, inspect, and revoke software licenses', sortOrder: 13 },
  { slug: 'api_management', name: 'API Management', description: 'Manage API keys, rate limits, domain restrictions, and logs', sortOrder: 14 },
  { slug: 'analytics', name: 'Analytics & Reports', description: 'Platform telemetry, revenue analytics, and performance logs', sortOrder: 15 },
  { slug: 'notifications', name: 'Notifications', description: 'System announcements, broadcasts, and alert management', sortOrder: 16 },
  { slug: 'audit_logs', name: 'Audit Logs', description: 'Immutable administrative audit trail of all actions and changes', sortOrder: 17 },
  { slug: 'settings', name: 'System Settings', description: 'Core system configurations, security policies, and integrations', sortOrder: 18 },
];

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // 1. Overview
  { slug: 'overview.view', name: 'View Overview Metrics', module: 'overview', action: 'view', level: 1, description: 'View system-wide counter statistics and quick status cards' },
  { slug: 'overview.analytics.view', name: 'View Dashboard Analytics Charts', module: 'overview', action: 'view', level: 2, description: 'View recent activities, registration trends, and revenue graphs' },

  // 2. Users
  { slug: 'users.view', name: 'View Users List', module: 'users', action: 'view', level: 1, description: 'View user directory and search accounts' },
  { slug: 'users.details.view', name: 'View User Details', module: 'users', action: 'view', level: 2, description: 'Inspect full user profile, project list, and purchase history' },
  { slug: 'users.create', name: 'Create Users', module: 'users', action: 'create', level: 3, description: 'Manually register and onboard new user accounts' },
  { slug: 'users.update', name: 'Update User Profiles', module: 'users', action: 'update', level: 3, description: 'Modify user profile data and account attributes' },
  { slug: 'users.suspend', name: 'Suspend & Block Users', module: 'users', action: 'suspend', level: 3, description: 'Temporarily suspend or permanently block user login access' },
  { slug: 'users.restore', name: 'Reactivate Users', module: 'users', action: 'restore', level: 3, description: 'Reactivate suspended or deactivated user accounts' },
  { slug: 'users.delete', name: 'Delete Users', module: 'users', action: 'delete', level: 3, description: 'Soft-delete or purge user records' },
  { slug: 'users.component.suspend_button', name: 'Show Suspend Button', module: 'users', action: 'view', level: 4, description: 'Render the action trigger to suspend an account' },
  { slug: 'users.data.view_all', name: 'View All Users Data', module: 'users', action: 'view', level: 5, description: 'Access records for all users without department restriction' },

  // 3. Roles
  { slug: 'roles.view', name: 'View Roles', module: 'roles', action: 'view', level: 1, description: 'View role catalogue and summary matrices' },
  { slug: 'roles.create', name: 'Create Custom Roles', module: 'roles', action: 'create', level: 3, description: 'Define new custom RBAC roles' },
  { slug: 'roles.update', name: 'Edit Roles', module: 'roles', action: 'update', level: 3, description: 'Modify role names, descriptions, and metadata' },
  { slug: 'roles.duplicate', name: 'Duplicate Roles', module: 'roles', action: 'create', level: 3, description: 'Clone an existing role with all its permission settings' },
  { slug: 'roles.delete', name: 'Delete Custom Roles', module: 'roles', action: 'delete', level: 3, description: 'Remove non-system custom roles' },
  { slug: 'roles.assign_permissions', name: 'Assign Permissions to Roles', module: 'roles', action: 'update', level: 3, description: 'Configure granular permission matrix checkboxes for a role' },
  { slug: 'roles.assign_users', name: 'Assign Roles to Users', module: 'roles', action: 'update', level: 3, description: 'Assign or remove roles for specific platform users' },

  // 4. Permissions
  { slug: 'permissions.view', name: 'View Permission Matrix', module: 'permissions', action: 'view', level: 1, description: 'Inspect available permissions and active assignments' },
  { slug: 'permissions.overrides.manage', name: 'Manage User Permission Overrides', module: 'permissions', action: 'update', level: 3, description: 'Grant or deny specific permissions directly on individual users' },

  // 5. Dashboard Access Control
  { slug: 'dashboard_access.view', name: 'View Dashboard Section Access', module: 'dashboard_access', action: 'view', level: 1, description: 'Inspect hierarchical dashboard module and page access tree' },
  { slug: 'dashboard_access.update', name: 'Update Dashboard Section Access', module: 'dashboard_access', action: 'update', level: 3, description: 'Enable or disable module/page visibility and access per role' },
  { slug: 'dashboard_access.preview', name: 'Preview Dashboard as Role', module: 'dashboard_access', action: 'view', level: 3, description: 'Simulate navigation and UI from the perspective of another role' },

  // 6. Developers
  { slug: 'developers.view', name: 'View Developers', module: 'developers', action: 'view', level: 1, description: 'Inspect registered developer accounts and SDK installations' },
  { slug: 'developers.export', name: 'Export Developer Data', module: 'developers', action: 'export', level: 3, description: 'Export developer reports and project telemetry' },

  // 7. Projects
  { slug: 'projects.view', name: 'View Website Projects', module: 'projects', action: 'view', level: 1, description: 'View developer projects and domain whitelists' },
  { slug: 'projects.update', name: 'Update Project Configurations', module: 'projects', action: 'update', level: 3, description: 'Modify project domain constraints and environments' },
  { slug: 'projects.delete', name: 'Delete Projects', module: 'projects', action: 'delete', level: 3, description: 'Delete or archive developer website projects' },

  // 8. Festivals
  { slug: 'festivals.view', name: 'View Festivals', module: 'festivals', action: 'view', level: 1, description: 'Inspect list of cultural festivals and seasonal collections' },
  { slug: 'festivals.create', name: 'Create Festivals', module: 'festivals', action: 'create', level: 3, description: 'Add new festivals, celebration dates, and themes' },
  { slug: 'festivals.update', name: 'Edit Festivals', module: 'festivals', action: 'update', level: 3, description: 'Modify festival details, descriptions, and banners' },
  { slug: 'festivals.delete', name: 'Delete Festivals', module: 'festivals', action: 'delete', level: 3, description: 'Remove festivals and associated collection groupings' },

  // 9. Animations
  { slug: 'animations.view', name: 'View Animations', module: 'animations', action: 'view', level: 1, description: 'Inspect animation catalog in draft, review, and published states' },
  { slug: 'animations.create', name: 'Create Animations', module: 'animations', action: 'create', level: 3, description: 'Upload and configure new animation packages' },
  { slug: 'animations.update', name: 'Edit Animations', module: 'animations', action: 'update', level: 3, description: 'Edit animation configurations, schemas, and assets' },
  { slug: 'animations.publish', name: 'Publish & Unpublish Animations', module: 'animations', action: 'publish', level: 3, description: 'Toggle live marketplace publication status' },
  { slug: 'animations.delete', name: 'Delete Animations', module: 'animations', action: 'delete', level: 3, description: 'Remove animations from the platform' },
  { slug: 'animations.component.create_button', name: 'Show Create Animation Button', module: 'animations', action: 'view', level: 4, description: 'Display upload and creation actions' },

  // 10. Marketplace
  { slug: 'marketplace.view', name: 'View Marketplace Controls', module: 'marketplace', action: 'view', level: 1, description: 'Inspect marketplace listings, pricing, and reviews' },
  { slug: 'marketplace.feature', name: 'Feature & Promote Animations', module: 'marketplace', action: 'update', level: 3, description: 'Select animations for home page and featured spots' },
  { slug: 'marketplace.reviews.moderate', name: 'Moderate Reviews', module: 'marketplace', action: 'update', level: 3, description: 'Approve, hide, or delete community ratings and reviews' },

  // 11. Subscriptions
  { slug: 'subscriptions.view', name: 'View Subscriptions', module: 'subscriptions', action: 'view', level: 1, description: 'Inspect active subscription plans and developer memberships' },
  { slug: 'subscriptions.plans.manage', name: 'Manage Subscription Plans', module: 'subscriptions', action: 'update', level: 3, description: 'Modify pricing tiers, quotas, and feature allocations' },

  // 12. Payments
  { slug: 'payments.view', name: 'View Payment Transactions', module: 'payments', action: 'view', level: 1, description: 'View financial ledger, orders, and payment statuses' },
  { slug: 'payments.refund', name: 'Issue Payment Refunds', module: 'payments', action: 'refund', level: 3, description: 'Refund developer purchases and orders' },
  { slug: 'payments.export', name: 'Export Financial Reports', module: 'payments', action: 'export', level: 3, description: 'Download CSV and PDF financial transaction reports' },
  { slug: 'payments.component.details', name: 'Show Payment Details Modal', module: 'payments', action: 'view', level: 4, description: 'Render full billing card and gateway transaction payloads' },
  { slug: 'payments.data.view_all', name: 'View All Transactions', module: 'payments', action: 'view', level: 5, description: 'Full access to financial records without department filter' },

  // 13. Licenses
  { slug: 'licenses.view', name: 'View Licenses', module: 'licenses', action: 'view', level: 1, description: 'Inspect issued developer and commercial license keys' },
  { slug: 'licenses.revoke', name: 'Revoke Licenses', module: 'licenses', action: 'update', level: 3, description: 'Revoke compromised or refunded license keys' },

  // 14. API Management
  { slug: 'api.view', name: 'View API Management', module: 'api_management', action: 'view', level: 1, description: 'Inspect active API keys and incoming request logs' },
  { slug: 'api.keys.revoke', name: 'Revoke API Keys', module: 'api_management', action: 'update', level: 3, description: 'Revoke client project API keys across the fleet' },

  // 15. Analytics
  { slug: 'analytics.view', name: 'View Telemetry Analytics', module: 'analytics', action: 'view', level: 1, description: 'Inspect telemetry, rendering performance, and SDK load graphs' },
  { slug: 'analytics.export', name: 'Export Analytics Data', module: 'analytics', action: 'export', level: 3, description: 'Export raw event logs and aggregation tables' },

  // 16. Notifications
  { slug: 'notifications.view', name: 'View Notification Broadcasts', module: 'notifications', action: 'view', level: 1, description: 'Inspect notification logs and user alert inbox' },
  { slug: 'notifications.create', name: 'Send System Announcements', module: 'notifications', action: 'create', level: 3, description: 'Broadcast global alerts and festival announcements' },

  // 17. Audit Logs
  { slug: 'audit_logs.view', name: 'View Audit Logs', module: 'audit_logs', action: 'view', level: 1, description: 'Inspect immutable administrative action trails' },
  { slug: 'audit_logs.export', name: 'Export Audit Trail', module: 'audit_logs', action: 'export', level: 3, description: 'Export audit trails for compliance verification' },

  // 18. Settings
  { slug: 'settings.view', name: 'View System Settings', module: 'settings', action: 'view', level: 1, description: 'Inspect security policies, CDN endpoints, and environment status' },
  { slug: 'settings.update', name: 'Update System Settings', module: 'settings', action: 'update', level: 3, description: 'Modify platform security controls, rate limits, and branding' },
  { slug: 'settings.security.mfa', name: 'Enforce MFA Policies', module: 'settings', action: 'update', level: 3, description: 'Configure mandatory multi-factor authentication for admins' },
];

export const SYSTEM_ROLE_SLUGS = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CONTENT_MANAGER: 'content_manager',
  ANIMATION_MANAGER: 'animation_manager',
  FESTIVAL_MANAGER: 'festival_manager',
  DEVELOPER_SUPPORT: 'developer_support',
  FINANCE_MANAGER: 'finance_manager',
  ANALYTICS_MANAGER: 'analytics_manager',
  MODERATOR: 'moderator',
  CUSTOM_ROLE: 'custom_role',
} as const;

export interface RolePreset {
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  isSuperAdmin: boolean;
  permissions: string[];
}

export const DEFAULT_ROLE_PRESETS: RolePreset[] = [
  {
    name: 'Super Admin',
    slug: SYSTEM_ROLE_SLUGS.SUPER_ADMIN,
    description: 'Platform owner with unrestricted access across all modules, settings, and controls.',
    isSystem: true,
    isSuperAdmin: true,
    permissions: ['*'], // Wildcard access
  },
  {
    name: 'Administrator',
    slug: SYSTEM_ROLE_SLUGS.ADMIN,
    description: 'Senior platform administrator with access to users, content, projects, and logs.',
    isSystem: true,
    isSuperAdmin: false,
    permissions: [
      'overview.view', 'overview.analytics.view',
      'users.view', 'users.details.view', 'users.create', 'users.update', 'users.suspend', 'users.restore', 'users.data.view_all',
      'roles.view',
      'permissions.view',
      'dashboard_access.view',
      'developers.view',
      'projects.view', 'projects.update',
      'festivals.view', 'festivals.create', 'festivals.update',
      'animations.view', 'animations.create', 'animations.update', 'animations.publish',
      'marketplace.view', 'marketplace.feature', 'marketplace.reviews.moderate',
      'subscriptions.view',
      'payments.view', 'payments.data.view_all',
      'licenses.view',
      'api.view',
      'analytics.view',
      'notifications.view', 'notifications.create',
      'audit_logs.view',
      'settings.view'
    ],
  },
  {
    name: 'Content Manager',
    slug: SYSTEM_ROLE_SLUGS.CONTENT_MANAGER,
    description: 'Manages festival calendars, animation packages, marketplace features, and reviews.',
    isSystem: true,
    isSuperAdmin: false,
    permissions: [
      'overview.view',
      'festivals.view', 'festivals.create', 'festivals.update',
      'animations.view', 'animations.create', 'animations.update', 'animations.publish',
      'marketplace.view', 'marketplace.feature', 'marketplace.reviews.moderate',
    ],
  },
  {
    name: 'Animation Manager',
    slug: SYSTEM_ROLE_SLUGS.ANIMATION_MANAGER,
    description: 'Specialized lead for animation runtime assets, upload schemas, and marketplace publishing.',
    isSystem: true,
    isSuperAdmin: false,
    permissions: [
      'overview.view',
      'animations.view', 'animations.create', 'animations.update', 'animations.publish', 'animations.delete', 'animations.component.create_button'
    ],
  },
  {
    name: 'Festival Manager',
    slug: SYSTEM_ROLE_SLUGS.FESTIVAL_MANAGER,
    description: 'Curates cultural festivals, dates, banners, and themed collections.',
    isSystem: true,
    isSuperAdmin: false,
    permissions: [
      'overview.view',
      'festivals.view', 'festivals.create', 'festivals.update', 'festivals.delete'
    ],
  },
  {
    name: 'Developer Support',
    slug: SYSTEM_ROLE_SLUGS.DEVELOPER_SUPPORT,
    description: 'Technical assistance for developers, inspecting API logs, website projects, and licenses.',
    isSystem: true,
    isSuperAdmin: false,
    permissions: [
      'overview.view',
      'users.view', 'users.details.view',
      'developers.view',
      'projects.view', 'projects.update',
      'licenses.view',
      'api.view',
      'analytics.view'
    ],
  },
  {
    name: 'Finance Manager',
    slug: SYSTEM_ROLE_SLUGS.FINANCE_MANAGER,
    description: 'Oversees billing, transactions, orders, refunds, and financial reporting.',
    isSystem: true,
    isSuperAdmin: false,
    permissions: [
      'overview.view',
      'subscriptions.view', 'subscriptions.plans.manage',
      'payments.view', 'payments.refund', 'payments.export', 'payments.component.details', 'payments.data.view_all'
    ],
  },
  {
    name: 'Analytics Manager',
    slug: SYSTEM_ROLE_SLUGS.ANALYTICS_MANAGER,
    description: 'Monitors runtime telemetry, performance benchmarks, and usage metrics.',
    isSystem: true,
    isSuperAdmin: false,
    permissions: [
      'overview.view', 'overview.analytics.view',
      'analytics.view', 'analytics.export'
    ],
  },
  {
    name: 'Moderator',
    slug: SYSTEM_ROLE_SLUGS.MODERATOR,
    description: 'Moderates user reviews, reported submissions, and public animation comments.',
    isSystem: true,
    isSuperAdmin: false,
    permissions: [
      'overview.view',
      'marketplace.view', 'marketplace.reviews.moderate'
    ],
  },
  {
    name: 'Custom Role Template',
    slug: SYSTEM_ROLE_SLUGS.CUSTOM_ROLE,
    description: 'Base custom template ready to be configured by the Super Admin.',
    isSystem: false,
    isSuperAdmin: false,
    permissions: ['overview.view'],
  },
];

export const DASHBOARD_TREE: DashboardModuleNode[] = [
  {
    slug: 'overview',
    name: 'Overview',
    icon: 'LayoutDashboard',
    route: '/overview',
    sortOrder: 1,
    permissionSlug: 'overview.view',
    pages: [
      { slug: 'overview_summary', name: 'Dashboard Overview', route: '/overview', permissionSlug: 'overview.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'users',
    name: 'User Management',
    icon: 'Users',
    route: '/users',
    sortOrder: 2,
    permissionSlug: 'users.view',
    pages: [
      { slug: 'users_list', name: 'All Users', route: '/users', permissionSlug: 'users.view', sortOrder: 1 },
      { slug: 'users_detail', name: 'User Details', route: '/users/[id]', permissionSlug: 'users.details.view', sortOrder: 2 }
    ]
  },
  {
    slug: 'roles',
    name: 'Role Management',
    icon: 'ShieldAlert',
    route: '/roles',
    sortOrder: 3,
    permissionSlug: 'roles.view',
    pages: [
      { slug: 'roles_list', name: 'Roles Directory', route: '/roles', permissionSlug: 'roles.view', sortOrder: 1 },
      { slug: 'roles_create', name: 'Create Custom Role', route: '/roles/new', permissionSlug: 'roles.create', sortOrder: 2 },
      { slug: 'roles_permissions', name: 'Role Permission Matrix', route: '/roles/[id]/permissions', permissionSlug: 'roles.assign_permissions', sortOrder: 3 }
    ]
  },
  {
    slug: 'permissions',
    name: 'Permission Management',
    icon: 'KeyRound',
    route: '/permissions',
    sortOrder: 4,
    permissionSlug: 'permissions.view',
    pages: [
      { slug: 'permissions_matrix', name: 'Permission Explorer & Overrides', route: '/permissions', permissionSlug: 'permissions.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'dashboard_access',
    name: 'Dashboard Access Control',
    icon: 'FolderTree',
    route: '/dashboard-access',
    sortOrder: 5,
    permissionSlug: 'dashboard_access.view',
    pages: [
      { slug: 'dashboard_access_tree', name: 'Module & Section Control Tree', route: '/dashboard-access', permissionSlug: 'dashboard_access.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'developers',
    name: 'Developer Management',
    icon: 'Code2',
    route: '/developers',
    sortOrder: 6,
    permissionSlug: 'developers.view',
    pages: [
      { slug: 'developers_list', name: 'Developer Directory', route: '/developers', permissionSlug: 'developers.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'projects',
    name: 'Website Projects',
    icon: 'Globe',
    route: '/projects',
    sortOrder: 7,
    permissionSlug: 'projects.view',
    pages: [
      { slug: 'projects_list', name: 'Registered Websites', route: '/projects', permissionSlug: 'projects.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'festivals',
    name: 'Festival Management',
    icon: 'Sparkles',
    route: '/festivals',
    sortOrder: 8,
    permissionSlug: 'festivals.view',
    pages: [
      { slug: 'festivals_list', name: 'Festival Directory', route: '/festivals', permissionSlug: 'festivals.view', sortOrder: 1 },
      { slug: 'festivals_create', name: 'New Festival', route: '/festivals/new', permissionSlug: 'festivals.create', sortOrder: 2 }
    ]
  },
  {
    slug: 'animations',
    name: 'Animation Management',
    icon: 'Film',
    route: '/animations',
    sortOrder: 9,
    permissionSlug: 'animations.view',
    pages: [
      { slug: 'animations_list', name: 'Animation Catalog', route: '/animations', permissionSlug: 'animations.view', sortOrder: 1 },
      { slug: 'animations_upload', name: 'New Animation', route: '/animations/new', permissionSlug: 'animations.create', sortOrder: 2 }
    ]
  },
  {
    slug: 'marketplace',
    name: 'Marketplace Management',
    icon: 'ShoppingBag',
    route: '/marketplace',
    sortOrder: 10,
    permissionSlug: 'marketplace.view',
    pages: [
      { slug: 'marketplace_catalog', name: 'Marketplace Listings', route: '/marketplace', permissionSlug: 'marketplace.view', sortOrder: 1 },
      { slug: 'marketplace_reviews', name: 'Review Moderation', route: '/marketplace/reviews', permissionSlug: 'marketplace.reviews.moderate', sortOrder: 2 }
    ]
  },
  {
    slug: 'subscriptions',
    name: 'Subscription Management',
    icon: 'CreditCard',
    route: '/subscriptions',
    sortOrder: 11,
    permissionSlug: 'subscriptions.view',
    pages: [
      { slug: 'subscriptions_list', name: 'Active Subscriptions', route: '/subscriptions', permissionSlug: 'subscriptions.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'payments',
    name: 'Payment Management',
    icon: 'DollarSign',
    route: '/payments',
    sortOrder: 12,
    permissionSlug: 'payments.view',
    pages: [
      { slug: 'payments_ledger', name: 'Payment Transactions', route: '/payments', permissionSlug: 'payments.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'licenses',
    name: 'License Management',
    icon: 'Award',
    route: '/licenses',
    sortOrder: 13,
    permissionSlug: 'licenses.view',
    pages: [
      { slug: 'licenses_list', name: 'Issued Licenses', route: '/licenses', permissionSlug: 'licenses.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'api_management',
    name: 'API Management',
    icon: 'Cpu',
    route: '/api-management',
    sortOrder: 14,
    permissionSlug: 'api.view',
    pages: [
      { slug: 'api_keys', name: 'API Keys & Logs', route: '/api-management', permissionSlug: 'api.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'analytics',
    name: 'Analytics & Reports',
    icon: 'BarChart3',
    route: '/analytics',
    sortOrder: 15,
    permissionSlug: 'analytics.view',
    pages: [
      { slug: 'analytics_telemetry', name: 'Platform Telemetry', route: '/analytics', permissionSlug: 'analytics.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'notifications',
    name: 'Notifications',
    icon: 'Bell',
    route: '/notifications',
    sortOrder: 16,
    permissionSlug: 'notifications.view',
    pages: [
      { slug: 'notifications_manager', name: 'Announcements & Alerts', route: '/notifications', permissionSlug: 'notifications.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'audit_logs',
    name: 'Audit Logs',
    icon: 'ScrollText',
    route: '/audit-logs',
    sortOrder: 17,
    permissionSlug: 'audit_logs.view',
    pages: [
      { slug: 'audit_logs_trail', name: 'Audit Trail Records', route: '/audit-logs', permissionSlug: 'audit_logs.view', sortOrder: 1 }
    ]
  },
  {
    slug: 'settings',
    name: 'System Settings',
    icon: 'Settings',
    route: '/settings',
    sortOrder: 18,
    permissionSlug: 'settings.view',
    pages: [
      { slug: 'settings_security', name: 'Security & System Controls', route: '/settings', permissionSlug: 'settings.view', sortOrder: 1 }
    ]
  }
];

/**
 * Authoritative Permission Resolution Algorithm:
 * 1. If user has isSuperAdmin or wildcard '*', returns true (super admin full access).
 * 2. Checks explicit DENY overrides first: if user has an explicit DENY override, returns false.
 * 3. Checks explicit ALLOW overrides: if user has an explicit ALLOW override, returns true.
 * 4. Combines all assigned role permissions. If ANY role has an explicit DENY effect for this permission, DENY takes precedence.
 * 5. If at least one assigned role has an ALLOW effect (or role grants wildcard '*'), returns true.
 * 6. Defaults to false (closed-by-default security model).
 */
export function evaluateUserPermission(
  requiredPermission: string,
  userPermissions: { slug: string; effect: 'ALLOW' | 'DENY' }[],
  userOverrides: { slug: string; effect: 'ALLOW' | 'DENY' }[] = [],
  isSuperAdmin: boolean = false
): boolean {
  if (isSuperAdmin) {
    return true;
  }

  // Check user-level overrides first
  const override = userOverrides.find((o) => o.slug === requiredPermission || o.slug === '*');
  if (override) {
    return override.effect === 'ALLOW';
  }

  // Check role-level explicit DENY (deny takes precedence over allow)
  const hasExplicitDeny = userPermissions.some(
    (p) => (p.slug === requiredPermission || p.slug === '*') && p.effect === 'DENY'
  );
  if (hasExplicitDeny) {
    return false;
  }

  // Check role-level ALLOW
  const hasAllow = userPermissions.some(
    (p) => (p.slug === requiredPermission || p.slug === '*') && p.effect === 'ALLOW'
  );

  return hasAllow;
}
