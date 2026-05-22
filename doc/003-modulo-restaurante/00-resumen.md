# Modulo restaurante

Primera version premium para negocios de comida en Mercadito Chimalteco.

## Alcance

- Mesas por negocio con codigo, estado, activo/inactivo y slug QR.
- Pedidos por mesa con items de productos activos del negocio.
- Creacion publica de pedidos desde QR sin login.
- Control de acceso por negocio: cada owner solo ve/modifica sus mesas y pedidos.
- Uso condicionado a `Business.modules` incluyendo `restaurant`.

## Fuera de alcance

- Pagos en linea.
- Delivery propio.
- FEL.
- Cocina en tiempo real.
- Impresion de comandas.
- Descuento de inventario.

## Decisiones

- El total del pedido se calcula en backend usando el precio actual del producto.
- El endpoint publico solo acepta productos activos del negocio.
- Las mesas inactivas no resuelven por QR publico.
- El modulo se activa manualmente desde backoffice actualizando `Business.modules`.
