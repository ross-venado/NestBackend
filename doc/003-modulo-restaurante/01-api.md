# API restaurante

Base local: `http://localhost:5001`

## Requisitos

- El usuario negocio debe estar autenticado con JWT.
- El negocio debe tener `restaurant` en `modules`.
- Para QR publico, el negocio debe estar `active` y la mesa debe estar `active`.

## Mesas negocio

Crear mesa:

```bash
curl -X POST "$API_URL/business/restaurant/tables" \
  -H "Authorization: Bearer $BUSINESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mesa 1","code":"MESA-1","status":"free","active":true}'
```

Listar mesas:

```bash
curl "$API_URL/business/restaurant/tables" \
  -H "Authorization: Bearer $BUSINESS_TOKEN"
```

Ver mesa:

```bash
curl "$API_URL/business/restaurant/tables/$TABLE_ID" \
  -H "Authorization: Bearer $BUSINESS_TOKEN"
```

Actualizar mesa:

```bash
curl -X PATCH "$API_URL/business/restaurant/tables/$TABLE_ID" \
  -H "Authorization: Bearer $BUSINESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"occupied"}'
```

Eliminar mesa:

```bash
curl -X DELETE "$API_URL/business/restaurant/tables/$TABLE_ID" \
  -H "Authorization: Bearer $BUSINESS_TOKEN"
```

## Pedidos negocio

Crear pedido autenticado:

```bash
curl -X POST "$API_URL/business/restaurant/orders" \
  -H "Authorization: Bearer $BUSINESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tableId":"'$TABLE_ID'","customerName":"QA","items":[{"productId":"'$PRODUCT_ID'","quantity":2,"notes":"sin cebolla"}]}'
```

Listar pedidos:

```bash
curl "$API_URL/business/restaurant/orders" \
  -H "Authorization: Bearer $BUSINESS_TOKEN"
```

Filtrar por estado:

```bash
curl "$API_URL/business/restaurant/orders?status=new" \
  -H "Authorization: Bearer $BUSINESS_TOKEN"
```

Cambiar estado:

```bash
curl -X PATCH "$API_URL/business/restaurant/orders/$ORDER_ID/status" \
  -H "Authorization: Bearer $BUSINESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"preparing"}'
```

Eliminar pedido:

```bash
curl -X DELETE "$API_URL/business/restaurant/orders/$ORDER_ID" \
  -H "Authorization: Bearer $BUSINESS_TOKEN"
```

## QR publico

Consultar mesa y menu:

```bash
curl "$API_URL/public/restaurants/$BUSINESS_SLUG/tables/$QR_SLUG"
```

Crear pedido desde QR:

```bash
curl -X POST "$API_URL/public/restaurants/$BUSINESS_SLUG/tables/$QR_SLUG/orders" \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Cliente QA","items":[{"productId":"'$PRODUCT_ID'","quantity":1,"notes":"bien caliente"}]}'
```

## Seguridad validada por diseno

- Los endpoints `/business/restaurant/*` requieren JWT y rol negocio/admin.
- El servicio siempre resuelve `businessId` desde el owner autenticado.
- Las consultas y mutaciones filtran por `businessId`.
- El endpoint publico recalcula precios y rechaza productos que no sean activos del negocio.
