# Flujo API por Curl

El flujo repetible esta en `scripts/qa-mvp.sh`. Usa `fetch` de Node para evitar depender de `jq`.

## Endpoints importantes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/backoffice/register`
- `PATCH /business/me`
- `GET /business/catalog-categories`
- `POST /business/catalog-categories`
- `POST /business/products`
- `POST /business/services`
- `PATCH /admin/businesses/:id/status`
- `GET /public/businesses/:slug`
- `GET /public/businesses/:slug/products`
- `GET /public/businesses/:slug/services`
- `GET /qr/businesses/:slug`

## Prueba rapida manual

```bash
curl http://127.0.0.1:5001/public/categories
curl http://127.0.0.1:5001/api
```

## Seguridad esperada

```bash
curl -i -X POST http://127.0.0.1:5001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Admin Publico","email":"blocked@example.test","password":"secret123","role":"admin"}'
```

Debe responder `400 Bad Request`, porque el registro publico no acepta `role`.
