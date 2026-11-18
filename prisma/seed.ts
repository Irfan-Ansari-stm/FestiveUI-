import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seed...');

  // 1. Roles & Permissions
  const roles = ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'USER'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `Standard ${roleName} system role`
      }
    });
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'SUPER_ADMIN' } });
  const devRole = await prisma.role.findUniqueOrThrow({ where: { name: 'DEVELOPER' } });

  // 2. Default Users
  const passwordHash = await bcrypt.hash('Festive@2026!', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@festiveui.com' },
    update: {},
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
          roleId: superAdminRole.id
        }
      }
    }
  });

  const sampleDeveloper = await prisma.user.upsert({
    where: { email: 'developer@festiveui.com' },
    update: {},
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
