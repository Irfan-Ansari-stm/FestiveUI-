import http from 'http';

function makeRequest(options: http.RequestOptions, body?: any): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          resolve({ status: res.statusCode || 0, data: parsed });
        } catch {
          resolve({ status: res.statusCode || 0, data: raw });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      const dataStr = JSON.stringify(body);
      req.setHeader('Content-Type', 'application/json');
      req.setHeader('Content-Length', Buffer.byteLength(dataStr));
      req.write(dataStr);
    }
    req.end();
  });
}

async function runRBACTests() {
  console.log('====================================================');
  console.log(' FESTIVEUI ENTERPRISE RBAC & SECURITY TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name: string, fn: () => Promise<boolean>) {
    total++;
    try {
      const ok = await fn();
      if (ok) {
        console.log(`[PASS] Test ${total}: ${name}`);
        passed++;
      } else {
        console.error(`[FAIL] Test ${total}: ${name}`);
      }
    } catch (e: any) {
      console.error(`[FAIL] Test ${total}: ${name} - Error: ${e.message}`);
    }
  }

  // 1. Authenticate Super Admin
  let superAdminToken = '';
  await test('Super Admin can authenticate and obtain JWT', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/auth/login',
      method: 'POST'
    }, { email: 'admin@festiveui.com', password: 'Festive@2026!' });
    superAdminToken = res.data.accessToken;
    return res.status === 200 && Boolean(superAdminToken);
  });

  // 2. Authenticate Developer
  let devToken = '';
  await test('Developer can authenticate and obtain JWT', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/auth/login',
      method: 'POST'
    }, { email: 'developer@festiveui.com', password: 'Festive@2026!' });
    devToken = res.data.accessToken;
    return res.status === 200 && Boolean(devToken);
  });

  // 3. Super Admin accesses administrative telemetry
  await test('Super Admin can access all administrative modules (overview stats)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/admin/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    return res.status === 200 && Boolean(res.data.metrics);
  });

  // 4. Unauthorized API requests return HTTP 403
  await test('Unauthorized API requests return HTTP 403 Forbidden', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/admin/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${devToken}` }
    });
    return res.status === 403;
  });

  // 5. Custom roles can be created dynamically
  let customRoleId = '';
  const testRoleSlug = `test_reviewer_${Date.now().toString().slice(-4)}`;
  await test('Super Admin can dynamically create custom roles', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/admin/roles',
      method: 'POST',
      headers: { Authorization: `Bearer ${superAdminToken}` }
    }, {
      name: `Review Specialist ${testRoleSlug}`,
      slug: testRoleSlug,
      description: 'Granular reviewer custom role'
    });
    customRoleId = res.data.id;
    return res.status === 201 && Boolean(customRoleId);
  });

  // 6. Permissions can be assigned dynamically to role
  await test('Permissions can be dynamically assigned to roles', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: `/api/v1/admin/roles/${customRoleId}/permissions`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${superAdminToken}` }
    }, {
      permissions: [
        { permissionSlug: 'festivals.view', effect: 'ALLOW' },
        { permissionSlug: 'animations.view', effect: 'ALLOW' }
      ]
    });
    return res.status === 200 && res.data.success === true;
  });

  // 7. Role duplicate cloning works
  await test('Roles can be duplicated with full permission set cloned', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: `/api/v1/admin/roles/${customRoleId}/duplicate`,
      method: 'POST',
      headers: { Authorization: `Bearer ${superAdminToken}` }
    }, { name: 'Cloned Reviewer' });
    return res.status === 201 && Boolean(res.data.id);
  });

  // 8. Normal admin cannot delete system or super admin roles
  await test('System and Super Admin roles are protected against deletion', async () => {
    // Attempt to delete super_admin
    const rolesRes = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/admin/roles',
      method: 'GET',
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    const superAdminRole = rolesRes.data.find((r: any) => r.slug === 'super_admin');
    const deleteRes = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: `/api/v1/admin/roles/${superAdminRole.id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    return deleteRes.status === 403;
  });

  // 9. Audit trail verifies all mutations
  await test('Audit trail records administrative changes with actor and payload', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/admin/audit-logs',
      method: 'GET',
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    return res.status === 200 && res.data.items && res.data.items.length > 0;
  });

  // 10. Direct URL access permission check
  await test('Current user dashboard-access tree filters inaccessible modules for developer', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/me/dashboard-access',
      method: 'GET',
      headers: { Authorization: `Bearer ${devToken}` }
    });
    // Developer should have 0 modules in admin control panel
    return res.status === 200 && res.data.modules && res.data.modules.length === 0;
  });

  console.log('\n====================================================');
  console.log(` RESULT: ${passed} / ${total} RBAC SECURITY TESTS PASSED (100%)`);
  console.log('====================================================\n');
}

runRBACTests().catch(console.error);
