import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  PERMISSION_GROUPS,
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PRESETS,
  DASHBOARD_TREE
} from '../packages/permissions/src/index.ts';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting advanced RBAC database seed...');

  // 1. Permission Groups
  for (const group of PERMISSION_GROUPS) {
    await prisma.permissionGroup.upsert({
      where: { slug: group.slug },
      update: { name: group.name, description: group.description, sortOrder: group.sortOrder },
      create: { slug: group.slug, name: group.name, description: group.description, sortOrder: group.sortOrder }
    });
  }
  console.log(`[Seed] Seeded ${PERMISSION_GROUPS.length} permission groups`);

  // 2. Granular Permissions
  const permissionMap = new Map<string, string>();
  for (const perm of ALL_PERMISSIONS) {
    const p = await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: { name: perm.name, module: perm.module, action: perm.action, level: perm.level, description: perm.description },
      create: { slug: perm.slug, name: perm.name, module: perm.module, action: perm.action, level: perm.level, description: perm.description }
    });
    permissionMap.set(perm.slug, p.id);
  }
  console.log(`[Seed] Seeded ${ALL_PERMISSIONS.length} granular permissions across 5 levels`);

  // 3. Roles and RolePermissions
  const roleMap = new Map<string, string>();
  for (const preset of DEFAULT_ROLE_PRESETS) {
    const role = await prisma.role.upsert({
      where: { slug: preset.slug },
      update: {
        name: preset.name,
        description: preset.description,
        isSystem: preset.isSystem,
        isSuperAdmin: preset.isSuperAdmin,
        status: 'ACTIVE'
      },
      create: {
        name: preset.name,
        slug: preset.slug,
        description: preset.description,
        isSystem: preset.isSystem,
        isSuperAdmin: preset.isSuperAdmin,
        status: 'ACTIVE'
      }
    });
    roleMap.set(preset.slug, role.id);
    roleMap.set(preset.name, role.id);

    // Assign role permissions
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    if (preset.permissions.includes('*')) {
      // Super admin has wildcard access to all permissions
      for (const [slug, permId] of permissionMap.entries()) {
        await prisma.rolePermission.create({
          data: { roleId: role.id, permissionId: permId, effect: 'ALLOW' }
        });
      }
    } else {
      for (const slug of preset.permissions) {
        const permId = permissionMap.get(slug);
        if (permId) {
          await prisma.rolePermission.create({
            data: { roleId: role.id, permissionId: permId, effect: 'ALLOW' }
          });
        }
      }
    }
  }

  // Developer and User roles compatibility
  const devRole = await prisma.role.upsert({
    where: { slug: 'developer' },
    update: { name: 'Developer', isSystem: true },
    create: { name: 'Developer', slug: 'developer', description: 'Website developer creating apps and generating API keys', isSystem: true }
  });
  roleMap.set('DEVELOPER', devRole.id);
  roleMap.set('developer', devRole.id);

  const userRole = await prisma.role.upsert({
    where: { slug: 'user' },
    update: { name: 'Standard User', isSystem: true },
    create: { name: 'Standard User', slug: 'user', description: 'End-user browsing animations and marketplace', isSystem: true }
  });
  roleMap.set('USER', userRole.id);
  roleMap.set('user', userRole.id);

  console.log(`[Seed] Seeded ${DEFAULT_ROLE_PRESETS.length + 2} roles with active permission assignments`);

  // 4. Dashboard Modules, Pages, and Actions
  for (const mod of DASHBOARD_TREE) {
    const dModule = await prisma.dashboardModule.upsert({
      where: { slug: mod.slug },
      update: { name: mod.name, icon: mod.icon, route: mod.route, sortOrder: mod.sortOrder, permissionSlug: mod.permissionSlug },
      create: { slug: mod.slug, name: mod.name, icon: mod.icon, route: mod.route, sortOrder: mod.sortOrder, permissionSlug: mod.permissionSlug }
    });

    for (const page of mod.pages) {
      const dPage = await prisma.dashboardPage.upsert({
        where: { slug: page.slug },
        update: { moduleId: dModule.id, name: page.name, route: page.route, sortOrder: page.sortOrder, permissionSlug: page.permissionSlug },
        create: { moduleId: dModule.id, slug: page.slug, name: page.name, route: page.route, sortOrder: page.sortOrder, permissionSlug: page.permissionSlug }
      });

      if (page.actions) {
        for (const act of page.actions) {
          await prisma.dashboardAction.create({
            data: { pageId: dPage.id, name: act.name, permissionSlug: act.permissionSlug }
          });
        }
      }
    }
  }
  console.log(`[Seed] Seeded ${DASHBOARD_TREE.length} dashboard modules & hierarchical section pages`);

  // 5. Default Users & Bootstrap Super Admin
  const passwordHash = await bcrypt.hash('Festive@2026!', 10);
  const superAdminRoleId = roleMap.get('super_admin')!;

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@festiveui.com' },
    update: { status: 'ACTIVE' },
    create: {
      email: 'admin@festiveui.com',
      passwordHash,
      emailVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Super',
          lastName: 'Admin',
          company: 'FestiveUI Technologies',
          country: 'United States'
        }
      },
      userRoles: {
        create: {
          roleId: superAdminRoleId
        }
      }
    }
  });

  const contentAdmin = await prisma.user.upsert({
    where: { email: 'content@festiveui.com' },
    update: { status: 'ACTIVE' },
    create: {
      email: 'content@festiveui.com',
      passwordHash,
      emailVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Sara',
          lastName: 'Content Lead',
          company: 'FestiveUI Creative Studio',
          country: 'United Kingdom'
        }
      },
      userRoles: {
        create: {
          roleId: roleMap.get('content_manager')!
        }
      }
    }
  });

  const financeAdmin = await prisma.user.upsert({
    where: { email: 'finance@festiveui.com' },
    update: { status: 'ACTIVE' },
    create: {
      email: 'finance@festiveui.com',
      passwordHash,
      emailVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'David',
          lastName: 'Finance Manager',
          company: 'FestiveUI Payments',
          country: 'Germany'
        }
      },
      userRoles: {
        create: {
          roleId: roleMap.get('finance_manager')!
        }
      }
    }
  });

  const sampleDeveloper = await prisma.user.upsert({
    where: { email: 'developer@festiveui.com' },
    update: { status: 'ACTIVE' },
    create: {
      email: 'developer@festiveui.com',
      passwordHash,
      emailVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Alex',
          lastName: 'Developer',
          company: 'NextGen Apps Inc.',
          country: 'Canada'
        }
      },
      userRoles: {
        create: {
          roleId: devRole.id
        }
      }
    }
  });

  // Seed initial audit log
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      actorEmail: 'admin@festiveui.com',
      action: 'SYSTEM_BOOTSTRAP',
      resource: 'platform/bootstrap',
      entityType: 'SYSTEM',
      entityId: superAdmin.id,
      metadata: {
        event: 'Enterprise Super Admin & RBAC Matrix initialized',
        timestamp: new Date().toISOString()
      }
    }
  });

  // 3. Subscription Plans
  const plans = [
    {
      code: 'FREE',
      name: 'Starter Plan',
      description: 'Ideal for personal hobby sites and open source projects.',
      priceMonthly: 0,
      priceYearly: 0,
      maxProjects: 3,
      maxApiRequests: 10000,
      features: ['Access to 10+ free animations', '3 Active Projects', 'Community Support', 'React & Vanilla SDKs']
    },
    {
      code: 'PRO',
      name: 'Developer Pro',
      description: 'Full animation suite and visual editor for professional engineers.',
      priceMonthly: 19,
      priceYearly: 190,
      maxProjects: 15,
      maxApiRequests: 100000,
      isPopular: true,
      features: ['All 15+ Core Animations', '15 Active Projects', 'Studio Visual Editor', 'Priority CDN delivery', 'All Framework SDKs']
    },
    {
      code: 'BUSINESS',
      name: 'Business Scale',
      description: 'High-traffic commercial stores, agencies and growth companies.',
      priceMonthly: 49,
      priceYearly: 490,
      maxProjects: 50,
      maxApiRequests: 500000,
      features: ['Unlimited Animations', '50 Active Projects', 'Commercial Web Whitelisting', 'Multi-domain API Keys', 'Dedicated Support']
    },
    {
      code: 'ENTERPRISE',
      name: 'Enterprise Custom',
      description: 'Bespoke animation effects, SLA and dedicated private infrastructure.',
      priceMonthly: 199,
      priceYearly: 1990,
      maxProjects: 200,
      maxApiRequests: 5000000,
      features: ['Custom Bespoke Animations', '200+ Projects', 'Dedicated Account Manager', 'Custom Licensing Agreement', '99.99% SLA']
    }
  ];

  for (const p of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { code: p.code },
      update: p,
      create: p
    });
  }

  // 4. Categories
  const categoriesData = [
    { name: 'Particles & Sparks', slug: 'particles', icon: 'Sparkles', description: 'Fluid, dynamic particle systems and atmospheric physics.' },
    { name: 'Vector Decorations', slug: 'decorations', icon: 'Sun', description: 'Intricate SVG geometric decorations, lamps and seasonal tokens.' },
    { name: 'Background Overlays', slug: 'backgrounds', icon: 'Layers', description: 'Full-bleed atmospheric backgrounds, snowfall, and dust.' },
    { name: 'Festive Borders', slug: 'borders', icon: 'Frame', description: 'Decorative garlands, lights, and corner borders.' },
    { name: 'Celebration Explosions', slug: 'celebrations', icon: 'Zap', description: 'High-energy fireworks, confetti blasts, and counters.' }
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat
    });
    categoryMap.set(cat.slug, c.id);
  }

  // 5. Festivals
  const festivalsData = [
    {
      name: 'Diwali',
      slug: 'diwali',
      description: 'Festival of Lights celebrating victory of light over darkness with glowing diyas, radiant fireworks, and vibrant rangolis.',
      thumbnailUrl: '/assets/festivals/diwali.jpg',
      isFeatured: true
    },
    {
      name: 'Holi',
      slug: 'holi',
      description: 'Festival of Colors featuring dynamic powder blasts, rainbow splashes, and joyful spring ambiance.',
      thumbnailUrl: '/assets/festivals/holi.jpg',
      isFeatured: true
    },
    {
      name: 'Christmas',
      slug: 'christmas',
      description: 'Yuletide holiday joy featuring realistic falling snowfall, twinkling fairy lights garland, and decorated Christmas trees.',
      thumbnailUrl: '/assets/festivals/christmas.jpg',
      isFeatured: true
    },
    {
      name: 'New Year',
      slug: 'new-year',
      description: 'Global New Year celebration featuring high-speed confetti showers, midnight countdowns, and brilliant firework rings.',
      thumbnailUrl: '/assets/festivals/new-year.jpg',
      isFeatured: true
    },
    {
      name: 'Eid',
      slug: 'eid',
      description: 'Luminous celebrations of Eid al-Fitr & Eid al-Adha featuring swaying Fanous Moroccan brass lanterns and golden crescent moons.',
      thumbnailUrl: '/assets/festivals/eid.jpg',
      isFeatured: true
    },
    {
      name: "Valentine's Day",
      slug: 'valentines-day',
      description: 'Romantic floating heart particles, floral petal showers, and tender aesthetic glow.',
      thumbnailUrl: '/assets/festivals/valentines.jpg',
      isFeatured: false
    },
    {
      name: 'Halloween',
      slug: 'halloween',
      description: 'Spooky animated flying bats, floating ghostly mist, and eerie flickering jack-o-lanterns.',
      thumbnailUrl: '/assets/festivals/halloween.jpg',
      isFeatured: false
    },
    {
      name: 'Independence Day',
      slug: 'independence-day',
      description: 'Patriotic celebratory ribbons, tricolor sparkles, and national pride banners.',
      thumbnailUrl: '/assets/festivals/independence.jpg',
      isFeatured: false
    }
  ];

  const festivalMap = new Map<string, string>();
  for (const f of festivalsData) {
    const fest = await prisma.festival.upsert({
      where: { slug: f.slug },
      update: f,
      create: f
    });
    festivalMap.set(f.slug, fest.id);
  }

  // 6. 15 Core Animations
  const animationsData = [
    {
      name: 'Diya Glow',
      slug: 'diya-glow',
      festivalSlug: 'diwali',
      categorySlug: 'decorations',
      format: 'svg',
      isFree: true,
      price: 0,
      description: 'Handcrafted clay diya lamp with real-time SVG flame flicker physics, radial lighting glow, and golden ornamental rim.',
      schemaJson: {
        type: 'diya-glow',
        properties: {
          size: { name: 'size', label: 'Diya Size (px)', type: 'range', default: 80, min: 40, max: 240, step: 4 },
          glow: { name: 'glow', label: 'Enable Glow Aura', type: 'boolean', default: true },
          glowIntensity: { name: 'glowIntensity', label: 'Glow Intensity', type: 'range', default: 0.8, min: 0.1, max: 1.0, step: 0.05 },
          flickerSpeed: { name: 'flickerSpeed', label: 'Flicker Speed', type: 'range', default: 1.0, min: 0.2, max: 3.0, step: 0.1 }
        }
      },
      defaultSettings: { size: 80, glow: true, glowIntensity: 0.8, flickerSpeed: 1.0 }
    },
    {
      name: 'Floating Diyas',
      slug: 'floating-diyas',
      festivalSlug: 'diwali',
      categorySlug: 'particles',
      format: 'canvas',
      isFree: false,
      price: 9.99,
      description: 'Tranquil water river physics with floating glowing diyas, bobbing wave motion, and shimmering reflections.',
      schemaJson: {
        type: 'floating-diyas',
        properties: {
          count: { name: 'count', label: 'Diya Count', type: 'range', default: 8, min: 2, max: 25, step: 1 },
          speed: { name: 'speed', label: 'Drift Speed', type: 'range', default: 1.0, min: 0.2, max: 3.0, step: 0.1 },
          glow: { name: 'glow', label: 'Water Glow Reflections', type: 'boolean', default: true }
        }
      },
      defaultSettings: { count: 8, speed: 1.0, glow: true }
    },
    {
      name: 'Diwali Fireworks',
      slug: 'diwali-fireworks',
      festivalSlug: 'diwali',
      categorySlug: 'celebrations',
      format: 'canvas',
      isFree: true,
      price: 0,
      description: 'Spectacular multi-color aerial rocket fireworks with spark trails, atmospheric smoke decay, and gravity simulation.',
      schemaJson: {
        type: 'diwali-fireworks',
        properties: {
          frequency: { name: 'frequency', label: 'Launch Frequency', type: 'range', default: 1.2, min: 0.3, max: 3.0, step: 0.1 },
          particleCount: { name: 'particleCount', label: 'Explosion Particles', type: 'range', default: 60, min: 20, max: 150, step: 10 }
        }
      },
      defaultSettings: { frequency: 1.2, particleCount: 60 }
    },
    {
      name: 'Rangoli Decoration',
      slug: 'rangoli-decoration',
      festivalSlug: 'diwali',
      categorySlug: 'decorations',
      format: 'svg',
      isFree: true,
      price: 0,
      description: 'Sacred geometric floral mandala with revolving concentric petals, vibrant pastel pigments, and soft center luminescence.',
      schemaJson: {
        type: 'rangoli-decoration',
        properties: {
          size: { name: 'size', label: 'Mandala Diameter (px)', type: 'range', default: 160, min: 80, max: 400, step: 10 },
          rotationSpeed: { name: 'rotationSpeed', label: 'Rotation Speed', type: 'range', default: 1.0, min: 0, max: 3.0, step: 0.1 }
        }
      },
      defaultSettings: { size: 160, rotationSpeed: 1.0 }
    },
    {
      name: 'Floating Golden Particles',
      slug: 'golden-particles',
      festivalSlug: 'diwali',
      categorySlug: 'backgrounds',
      format: 'canvas',
      isFree: true,
      price: 0,
      description: 'Ethereal shimmering gold dust floating upwards with sine-wave wind drift, depth parallax, and ambient sparkle.',
      schemaJson: {
        type: 'golden-particles',
        properties: {
          count: { name: 'count', label: 'Dust Particle Count', type: 'range', default: 50, min: 15, max: 150, step: 5 },
          speed: { name: 'speed', label: 'Rise Speed', type: 'range', default: 1.0, min: 0.2, max: 3.0, step: 0.1 }
        }
      },
      defaultSettings: { count: 50, speed: 1.0 }
    },
    {
      name: 'Holi Color Splash',
      slug: 'holi-color-splash',
      festivalSlug: 'holi',
      categorySlug: 'celebrations',
      format: 'canvas',
      isFree: true,
      price: 0,
      description: 'High-velocity paint splashes and Gulal bursts with authentic splatter droplets and vibrant festive pigment colors.',
      schemaJson: {
        type: 'holi-color-splash',
        properties: {
          burstRate: { name: 'burstRate', label: 'Color Burst Rate', type: 'range', default: 1.0, min: 0.2, max: 2.5, step: 0.1 },
          dropletCount: { name: 'dropletCount', label: 'Droplets Per Blast', type: 'range', default: 45, min: 15, max: 100, step: 5 }
        }
      },
      defaultSettings: { burstRate: 1.0, dropletCount: 45 }
    },
    {
      name: 'Holi Color Particles',
      slug: 'holi-color-particles',
      festivalSlug: 'holi',
      categorySlug: 'particles',
      format: 'canvas',
      isFree: false,
      price: 12.99,
      description: 'Billowing Gulal pigment powder clouds dispersing smoothly in the atmospheric wind with soft gradient diffusion.',
      schemaJson: {
        type: 'holi-color-particles',
        properties: {
          intensity: { name: 'intensity', label: 'Smoke Billow Rate', type: 'range', default: 1.0, min: 0.3, max: 2.5, step: 0.1 },
          cloudSize: { name: 'cloudSize', label: 'Powder Cloud Size', type: 'range', default: 40, min: 20, max: 90, step: 5 }
        }
      },
      defaultSettings: { intensity: 1.0, cloudSize: 40 }
    },
    {
      name: 'Falling Snow',
      slug: 'falling-snow',
      festivalSlug: 'christmas',
      categorySlug: 'backgrounds',
      format: 'canvas',
      isFree: true,
      price: 0,
      description: 'Hypnotic multi-layer winter snowfall with variable crystalline flake sizes, sway physics, and directional wind drift.',
      schemaJson: {
        type: 'falling-snow',
        properties: {
          count: { name: 'count', label: 'Snowflake Count', type: 'range', default: 80, min: 20, max: 250, step: 10 },
          speed: { name: 'speed', label: 'Fall Speed', type: 'range', default: 1.0, min: 0.2, max: 3.0, step: 0.1 },
          wind: { name: 'wind', label: 'Wind Drift', type: 'range', default: 15, min: -50, max: 50, step: 5 }
        }
      },
      defaultSettings: { count: 80, speed: 1.0, wind: 15 }
    },
    {
      name: 'Christmas Lights',
      slug: 'christmas-lights',
      festivalSlug: 'christmas',
      categorySlug: 'borders',
      format: 'svg',
      isFree: true,
      price: 0,
      description: 'Festive fairy light garland strung along borders with multi-color glowing bulbs and dynamic sequential twinkle effects.',
      schemaJson: {
        type: 'christmas-lights',
        properties: {
          bulbCount: { name: 'bulbCount', label: 'Bulb Count', type: 'range', default: 12, min: 6, max: 24, step: 2 },
          twinkleSpeed: { name: 'twinkleSpeed', label: 'Twinkle Speed', type: 'range', default: 1.0, min: 0.2, max: 3.0, step: 0.1 }
        }
      },
      defaultSettings: { bulbCount: 12, twinkleSpeed: 1.0 }
    },
    {
      name: 'Christmas Tree Decoration',
      slug: 'christmas-tree',
      festivalSlug: 'christmas',
      categorySlug: 'decorations',
      format: 'svg',
      isFree: false,
      price: 14.99,
      description: 'Stylized evergreen pine tree with twinkling colorful glass baubles and glowing golden topper star.',
      schemaJson: {
        type: 'christmas-tree',
        properties: {
          size: { name: 'size', label: 'Tree Height (px)', type: 'range', default: 120, min: 60, max: 280, step: 10 },
          starGlow: { name: 'starGlow', label: 'Star Radiance', type: 'boolean', default: true }
        }
      },
      defaultSettings: { size: 120, starGlow: true }
    },
    {
      name: 'New Year Confetti',
      slug: 'new-year-confetti',
      festivalSlug: 'new-year',
      categorySlug: 'celebrations',
      format: 'canvas',
      isFree: true,
      price: 0,
      description: 'Festive celebratory confetti ribbons and paper slips tumbling with realistic 3D paper rotation and air resistance.',
      schemaJson: {
        type: 'new-year-confetti',
        properties: {
          count: { name: 'count', label: 'Confetti Density', type: 'range', default: 90, min: 25, max: 250, step: 10 },
          gravity: { name: 'gravity', label: 'Fall Acceleration', type: 'range', default: 120, min: 40, max: 300, step: 10 }
        }
      },
      defaultSettings: { count: 90, gravity: 120 }
    },
    {
      name: 'Fireworks Burst',
      slug: 'fireworks-burst',
      festivalSlug: 'new-year',
      categorySlug: 'celebrations',
      format: 'canvas',
      isFree: false,
      price: 9.99,
      description: 'Synchronized multi-tier ring fireworks explosion with willow trails and brilliant flash aura.',
      schemaJson: {
        type: 'fireworks-burst',
        properties: {
          burstInterval: { name: 'burstInterval', label: 'Interval (seconds)', type: 'range', default: 1.5, min: 0.5, max: 3.5, step: 0.25 },
          ringDensity: { name: 'ringDensity', label: 'Ring Sparks Count', type: 'range', default: 60, min: 24, max: 120, step: 6 }
        }
      },
      defaultSettings: { burstInterval: 1.5, ringDensity: 60 }
    },
    {
      name: 'Countdown Animation',
      slug: 'countdown-animation',
      festivalSlug: 'new-year',
      categorySlug: 'celebrations',
      format: 'svg',
      isFree: true,
      price: 0,
      description: 'Event celebration countdown badge with animated radial progress ring and sparkling digits.',
      schemaJson: {
        type: 'countdown-animation',
        properties: {
          size: { name: 'size', label: 'Badge Size (px)', type: 'range', default: 110, min: 70, max: 220, step: 10 },
          startFrom: { name: 'startFrom', label: 'Countdown Start', type: 'range', default: 10, min: 3, max: 60, step: 1 }
        }
      },
      defaultSettings: { size: 110, startFrom: 10 }
    },
    {
      name: 'Eid Lantern',
      slug: 'eid-lantern',
      festivalSlug: 'eid',
      categorySlug: 'decorations',
      format: 'svg',
      isFree: true,
      price: 0,
      description: 'Intricate swaying Moroccan Fanous brass lantern with warm candle flame, filigree lattice, and swinging chain.',
      schemaJson: {
        type: 'eid-lantern',
        properties: {
          size: { name: 'size', label: 'Lantern Height (px)', type: 'range', default: 130, min: 70, max: 260, step: 10 },
          swingSpeed: { name: 'swingSpeed', label: 'Swaying Motion', type: 'range', default: 1.0, min: 0.2, max: 2.5, step: 0.1 }
        }
      },
      defaultSettings: { size: 130, swingSpeed: 1.0 }
    },
    {
      name: 'Crescent Moon Decoration',
      slug: 'crescent-moon',
      festivalSlug: 'eid',
      categorySlug: 'decorations',
      format: 'svg',
      isFree: false,
      price: 11.99,
      description: 'Luminous golden crescent moon with dangling celestial star, soft moonlight aura, and gentle pendulum sway physics.',
      schemaJson: {
        type: 'crescent-moon',
        properties: {
          size: { name: 'size', label: 'Crescent Moon Size (px)', type: 'range', default: 110, min: 60, max: 260, step: 10 },
          swayStar: { name: 'swayStar', label: 'Star Sway Physics', type: 'boolean', default: true }
        }
      },
      defaultSettings: { size: 110, swayStar: true }
    }
  ];

  for (const a of animationsData) {
    const festId = festivalMap.get(a.festivalSlug)!;
    const catId = categoryMap.get(a.categorySlug)!;

    const anim = await prisma.animation.upsert({
      where: { slug: a.slug },
      update: {
        name: a.name,
        description: a.description,
        thumbnailUrl: `/assets/animations/${a.slug}.png`,
        format: a.format,
        isFree: a.isFree,
        price: a.price,
        status: 'PUBLISHED'
      },
      create: {
        name: a.name,
        slug: a.slug,
        festivalId: festId,
        categoryId: catId,
        description: a.description,
        thumbnailUrl: `/assets/animations/${a.slug}.png`,
        format: a.format,
        isFree: a.isFree,
        price: a.price,
        licenseType: a.isFree ? 'free' : 'commercial',
        status: 'PUBLISHED',
        schema: {
          create: {
            schemaJson: a.schemaJson,
            defaultSettings: a.defaultSettings
          }
        },
        versions: {
          create: {
            version: '1.0.0',
            changelog: 'Initial production release with verified responsive rendering'
          }
        }
      }
    });

    console.log(`[Seed] Seeded animation: ${anim.name} (${anim.slug})`);
  }

  // 7. Developer Project & API Key
  const project = await prisma.project.create({
    data: {
      userId: sampleDeveloper.id,
      name: 'Diwali Showcase Website',
      websiteUrl: 'https://diwali-demo.local',
      framework: 'react',
      environment: 'development',
      domains: {
        create: [
          { domain: 'localhost', verified: true },
          { domain: '127.0.0.1', verified: true }
        ]
      },
      apiKeys: {
        create: {
          name: 'Development Secret Key',
          keyPrefix: 'fst_live_e9a1',
          keyHash: await bcrypt.hash('fst_live_e9a1847120db84f1a23', 10)
        }
      },
      editorDocs: {
        create: {
          userId: sampleDeveloper.id,
          title: 'Hero Section Festive Banner',
          mode: 'website',
          targetSelector: '#hero',
          content: {
            mode: 'website',
            viewport: 'desktop',
            backgroundColor: '#0F172A',
            zoom: 1,
            layers: [
              {
                id: 'layer-diya-1',
                name: 'Bottom Right Diya',
                animationSlug: 'diya-glow',
                animationType: 'diya-glow',
                visible: true,
                locked: false,
                config: {
                  type: 'diya-glow',
                  position: 'bottom-right',
                  size: 80,
                  opacity: 1,
                  zIndex: 50,
                  settings: { glow: true, glowIntensity: 0.8, flickerSpeed: 1.0 }
                }
              },
              {
                id: 'layer-fireworks-1',
                name: 'Background Fireworks',
                animationSlug: 'diwali-fireworks',
                animationType: 'diwali-fireworks',
                visible: true,
                locked: false,
                config: {
                  type: 'diwali-fireworks',
                  position: 'full',
                  opacity: 0.85,
                  zIndex: 10,
                  settings: { frequency: 1.2, particleCount: 60 }
                }
              }
            ]
          }
        }
      }
    }
  });

  console.log(`[Seed] Seeded project: ${project.name} (${project.id})`);

  // 8. Seed Additional Enterprise Applications
  const enterpriseApps = [
    {
      name: 'Global Flagship eCommerce Store',
      websiteUrl: 'https://store.festiveui.com',
      framework: 'next',
      environment: 'production',
      domain: 'store.festiveui.com'
    },
    {
      name: 'Holiday Promotional Campaign App',
      websiteUrl: 'https://holiday.festiveui.com',
      framework: 'react',
      environment: 'production',
      domain: 'holiday.festiveui.com'
    },
    {
      name: 'Mobile Checkout Experience',
      websiteUrl: 'https://m.festiveui.com',
      framework: 'vue',
      environment: 'production',
      domain: 'm.festiveui.com'
    },
    {
      name: 'Customer Portal & Documentation',
      websiteUrl: 'https://docs.festiveui.com',
      framework: 'next',
      environment: 'staging',
      domain: 'docs.festiveui.com'
    }
  ];

  for (const app of enterpriseApps) {
    const existingApp = await prisma.project.findFirst({ where: { name: app.name } });
    if (!existingApp) {
      await prisma.project.create({
        data: {
          userId: sampleDeveloper.id,
          name: app.name,
          websiteUrl: app.websiteUrl,
          framework: app.framework,
          environment: app.environment,
          domains: {
            create: [
              { domain: app.domain, verified: true },
              { domain: 'localhost:3000', verified: true }
            ]
          },
          apiKeys: {
            create: {
              name: `${app.name} Live Key`,
              keyPrefix: `fst_live_${Math.random().toString(36).substring(2, 6)}`,
              keyHash: await bcrypt.hash(`fst_live_key_${app.name}`, 10)
            }
          }
        }
      });
    }
  }

  // 9. Seed Festival Campaigns
  const diwaliFest = await prisma.festival.findUnique({ where: { slug: 'diwali' } });
  const christmasFest = await prisma.festival.findUnique({ where: { slug: 'christmas' } });
  const newYearFest = await prisma.festival.findUnique({ where: { slug: 'new-year' } });
  const eidFest = await prisma.festival.findUnique({ where: { slug: 'eid' } });
  const holiFest = await prisma.festival.findUnique({ where: { slug: 'holi' } });
  const halloweenFest = await prisma.festival.findUnique({ where: { slug: 'halloween' } });

  const campaigns = [
    {
      name: 'Diwali Festival of Lights 2026',
      festivalId: diwaliFest?.id,
      status: 'ACTIVE',
      scheduleStart: new Date('2026-10-25T00:00:00Z'),
      scheduleEnd: new Date('2026-11-20T23:59:59Z'),
      intensity: 'SPECTACULAR',
      targetDomains: ['store.festiveui.com', 'holiday.festiveui.com', 'm.festiveui.com', 'localhost:3000'],
      rendersCount: 482900,
      animations: ['diya-glow', 'diwali-fireworks', 'golden-particles']
    },
    {
      name: 'Winter Holiday & Snowfall Season',
      festivalId: christmasFest?.id,
      status: 'ACTIVE',
      scheduleStart: new Date('2026-12-01T00:00:00Z'),
      scheduleEnd: new Date('2026-12-31T23:59:59Z'),
      intensity: 'BALANCED',
      targetDomains: ['store.festiveui.com', 'holiday.festiveui.com', 'm.festiveui.com'],
      rendersCount: 320500,
      animations: ['falling-snow', 'christmas-lights', 'christmas-tree']
    },
    {
      name: 'Global New Year 2027 Countdown',
      festivalId: newYearFest?.id,
      status: 'SCHEDULED',
      scheduleStart: new Date('2026-12-30T00:00:00Z'),
      scheduleEnd: new Date('2027-01-05T23:59:59Z'),
      intensity: 'SPECTACULAR',
      targetDomains: ['store.festiveui.com', 'holiday.festiveui.com', 'm.festiveui.com', 'docs.festiveui.com'],
      rendersCount: 280900,
      animations: ['new-year-confetti', 'fireworks-burst', 'countdown-animation']
    },
    {
      name: 'Eid al-Fitr Illuminated Lanterns',
      festivalId: eidFest?.id,
      status: 'ACTIVE',
      scheduleStart: new Date('2027-03-20T00:00:00Z'),
      scheduleEnd: new Date('2027-04-05T23:59:59Z'),
      intensity: 'SUBTLE',
      targetDomains: ['store.festiveui.com', 'm.festiveui.com'],
      rendersCount: 162900,
      animations: ['eid-lantern', 'crescent-moon']
    },
    {
      name: 'Holi Colors Spring Festival',
      festivalId: holiFest?.id,
      status: 'SCHEDULED',
      scheduleStart: new Date('2027-03-08T00:00:00Z'),
      scheduleEnd: new Date('2027-03-16T23:59:59Z'),
      intensity: 'SPECTACULAR',
      targetDomains: ['holiday.festiveui.com', 'm.festiveui.com'],
      rendersCount: 154200,
      animations: ['holi-color-splash', 'holi-color-particles']
    },
    {
      name: 'Halloween Twilight Fog & Spooks',
      festivalId: halloweenFest?.id,
      status: 'DRAFT',
      scheduleStart: new Date('2026-10-20T00:00:00Z'),
      scheduleEnd: new Date('2026-11-02T23:59:59Z'),
      intensity: 'BALANCED',
      targetDomains: [],
      rendersCount: 42100,
      animations: []
    }
  ];

  for (const c of campaigns) {
    const existing = await prisma.campaign.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.campaign.create({ data: c });
    }
  }

  // 10. Seed System Alerts
  const alerts = [
    {
      severity: 'INFO',
      title: 'Global Edge CDN Cache Synchronized',
      message: 'All 285 Cloudflare edge Points of Presence successfully verified cache consistency.',
      source: 'CDN',
      resolved: true
    },
    {
      severity: 'WARNING',
      title: 'High API Burst on /v1/render/diya-glow',
      message: 'Client domain store.festiveui.com experienced 1,480 req/min (normal 600 req/min). Auto-scaled safely.',
      source: 'API',
      resolved: true
    },
    {
      severity: 'INFO',
      title: 'PostgreSQL 16 Connection Pool Healthy',
      message: 'Primary read/write connection pool at 12 active / 100 max connections. Latency < 1.2ms.',
      source: 'DATABASE',
      resolved: false
    }
  ];

  for (const a of alerts) {
    const existing = await prisma.systemAlert.findFirst({ where: { title: a.title } });
    if (!existing) {
      await prisma.systemAlert.create({ data: a });
    }
  }

  // 11. Seed Platform Settings
  const settings = [
    { key: 'platform.name', value: 'FestiveUI Enterprise Cloud', category: 'GENERAL', description: 'Public facing platform service name' },
    { key: 'platform.environment', value: 'PRODUCTION', category: 'GENERAL', description: 'Deployment cluster environment' },
    { key: 'cdn.provider', value: 'Cloudflare Enterprise', category: 'CDN', description: 'Global content delivery network provider' },
    { key: 'cdn.auto_purge', value: 'true', category: 'CDN', description: 'Automatically purge CDN when animations or themes update' },
    { key: 'api.rate_limit_per_minute', value: '1000', category: 'SECURITY', description: 'Default API request limit per minute for verified domains' },
    { key: 'runtime.target_fps', value: '60', category: 'RUNTIME', description: 'Target canvas animation frames per second' },
    { key: 'runtime.hardware_acceleration', value: 'true', category: 'RUNTIME', description: 'Require GPU canvas acceleration where available' }
  ];

  for (const s of settings) {
    await prisma.platformSetting.upsert({
      where: { key: s.key },
      update: s,
      create: s
    });
  }

  console.log('[Seed] Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('[Seed] Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
