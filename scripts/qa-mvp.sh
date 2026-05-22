#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://127.0.0.1:5001}"
ADMIN_SETUP_KEY="${ADMIN_SETUP_KEY:-}"

if [ -z "$ADMIN_SETUP_KEY" ]; then
  echo "Set ADMIN_SETUP_KEY before running this QA flow."
  echo "Example: ADMIN_SETUP_KEY=local-qa-key API_URL=http://127.0.0.1:5001 scripts/qa-mvp.sh"
  exit 1
fi

API_URL="$API_URL" ADMIN_SETUP_KEY="$ADMIN_SETUP_KEY" node <<'NODE'
const API = process.env.API_URL;
const setupKey = process.env.ADMIN_SETUP_KEY;
const stamp = Date.now();
const password = 'secret123';
const bizEmail = `qa-business-${stamp}@mercadito.test`;
const otherEmail = `qa-other-${stamp}@mercadito.test`;
const adminEmail = `qa-admin-${stamp}@mercadito.test`;

async function request(path, options = {}) {
  const { token, allowFail, ...init } = options;
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok && !allowFail) {
    throw new Error(`${init.method || 'GET'} ${path} -> ${response.status} ${text}`);
  }
  return { status: response.status, ok: response.ok, body };
}

async function main() {
  const categories = (await request('/public/categories')).body;
  const categoryId =
    categories.find((category) => category.slug === 'comida-y-restaurantes')?._id ||
    categories[0]?._id;

  const blocked = await request('/auth/register', {
    method: 'POST',
    allowFail: true,
    body: JSON.stringify({
      name: 'Blocked Admin',
      email: `blocked-${stamp}@mercadito.test`,
      password,
      role: 'admin',
    }),
  });
  if (blocked.status !== 400) {
    throw new Error(`Public admin registration was not blocked. Status: ${blocked.status}`);
  }

  const owner = (
    await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'QA Negocio', email: bizEmail, password }),
    })
  ).body;
  if (owner.user.role !== 'business_owner') {
    throw new Error('Public registration did not create a business owner.');
  }

  const ownerLogin = (
    await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: bizEmail, password }),
    })
  ).body;

  const businessSlug = `qa-comedor-${stamp}`;
  const business = (
    await request('/business/me', {
      method: 'PATCH',
      token: ownerLogin.token,
      body: JSON.stringify({
        name: 'QA Comedor',
        slug: businessSlug,
        description: 'Comida de prueba QA',
        categoryId,
        phone: '50255550000',
        whatsapp: '50255550000',
        address: 'Chimaltenango zona 5',
        modules: ['marketplace'],
      }),
    })
  ).body;

  const catalogCategory = (
    await request('/business/catalog-categories', {
      method: 'POST',
      token: ownerLogin.token,
      body: JSON.stringify({
        name: 'Almuerzos',
        description: 'Categoria QA',
        type: 'both',
        active: true,
      }),
    })
  ).body;

  const product = (
    await request('/business/products', {
      method: 'POST',
      token: ownerLogin.token,
      body: JSON.stringify({
        name: 'Caldo QA',
        description: 'Producto QA',
        price: 30,
        category: catalogCategory.name,
        status: 'active',
      }),
    })
  ).body;

  const service = (
    await request('/business/services', {
      method: 'POST',
      token: ownerLogin.token,
      body: JSON.stringify({
        name: 'Evento QA',
        description: 'Servicio QA',
        priceFrom: 100,
        priceTo: 200,
        category: catalogCategory.name,
        status: 'active',
      }),
    })
  ).body;

  const other = (
    await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'QA Otro', email: otherEmail, password }),
    })
  ).body;
  await request('/business/me', {
    method: 'PATCH',
    token: other.token,
    body: JSON.stringify({
      name: 'QA Otro Local',
      slug: `qa-otro-${stamp}`,
      modules: ['marketplace'],
    }),
  });

  const crossBusinessAttempt = await request(`/business/products/${product._id}`, {
    method: 'PATCH',
    token: other.token,
    allowFail: true,
    body: JSON.stringify({ name: 'Hack' }),
  });
  if (crossBusinessAttempt.status !== 404) {
    throw new Error('Cross-business product update was not blocked.');
  }

  await request('/auth/backoffice/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'QA Admin',
      email: adminEmail,
      password,
      setupKey,
      adminRole: 'operations',
    }),
  });
  const adminLogin = (
    await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: adminEmail, password }),
    })
  ).body;
  if (adminLogin.user.role !== 'admin') {
    throw new Error('Admin login did not return admin role.');
  }

  await request(`/admin/businesses/${business._id}/status`, {
    method: 'PATCH',
    token: adminLogin.token,
    body: JSON.stringify({ status: 'active', plan: 'basic' }),
  });

  const publicBusiness = (await request(`/public/businesses/${businessSlug}`)).body;
  const publicProducts = (await request(`/public/businesses/${businessSlug}/products`)).body;
  const publicServices = (await request(`/public/businesses/${businessSlug}/services`)).body;
  const qr = (await request(`/qr/businesses/${businessSlug}`)).body;

  if (publicBusiness.slug !== businessSlug) throw new Error('Public business not visible.');
  if (!publicProducts.some((item) => item._id === product._id)) throw new Error('Public product missing.');
  if (!publicServices.some((item) => item._id === service._id)) throw new Error('Public service missing.');
  if (!qr.value.includes(`/businesses/${businessSlug}`)) throw new Error('QR payload is wrong.');

  console.log(JSON.stringify({
    ok: true,
    businessSlug,
    businessUrl: `${API}/public/businesses/${businessSlug}`,
    frontendUrl: `http://localhost:3000/businesses/${businessSlug}`,
    businessEmail: bizEmail,
    adminEmail,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
NODE
