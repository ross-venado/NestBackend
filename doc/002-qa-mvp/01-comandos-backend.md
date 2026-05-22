# Comandos Backend

## Variables

```bash
PORT=5001
MONGODB_URI=mongodb://localhost:27017/mercadito_chimalteco
APP_PUBLIC_URL=http://localhost:3000
AUTH_TOKEN_SECRET=change-me-in-production
ADMIN_SETUP_KEY=change-me-for-admin-bootstrap
CORS_ORIGIN=http://localhost:3000,http://localhost:8000
```

## Instalar y levantar

```bash
cd /Users/venado/Project/chimaltenango/backend
npm install
npm run seed
ADMIN_SETUP_KEY=local-qa-key AUTH_TOKEN_SECRET=local-auth-secret npm run start
```

## Validaciones

```bash
npm run build
npm run lint
npm test
```

## QA automatico

```bash
cd /Users/venado/Project/chimaltenango/backend
ADMIN_SETUP_KEY=local-qa-key API_URL=http://127.0.0.1:5001 scripts/qa-mvp.sh
```
