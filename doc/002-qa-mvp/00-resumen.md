# QA MVP Backend

Este documento cierra la primera version funcional del backend de Mercadito Chimalteco.

## Alcance validado

- Registro publico crea solo usuarios de negocio.
- Intentar registrar `role: admin` desde el endpoint publico falla por validacion.
- Alta privada de admin usa `ADMIN_SETUP_KEY`.
- Endpoints admin requieren token de usuario admin.
- Endpoints de negocio requieren token.
- Un negocio no puede modificar productos de otro negocio.
- Negocio puede crear perfil, categorias internas, productos y servicios.
- Admin puede aprobar negocio.
- Endpoints publicos muestran negocio, productos y servicios activos.
- QR backend devuelve la URL publica del local.

## Problemas encontrados

- El backend anterior seguia corriendo y no tenia el modulo `business-catalog-categories`; se reinicio la API.
- Sin `ADMIN_SETUP_KEY` el alta privada de admin no puede funcionar; es requerido por seguridad.
- Para pruebas locales por terminal se recomienda `127.0.0.1` si `localhost` resuelve raro en el entorno.
