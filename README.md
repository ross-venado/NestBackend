## 🧪 backend/README.md - API de Productos con NestJS + MongoDB

Este proyecto es una API REST sencilla para gestionar productos, construida con **NestJS** y usando **MongoDB** como base de datos.

Ideal para conectarlo con un frontend tipo Gatsby o cualquier cliente que necesite consultar o crear productos.

---

### 🚀 ¿Qué hace esta API?

* ✅ `GET /products` → Lista todos los productos
* ✅ `POST /products` → Crea un nuevo producto con nombre, precio e imagen
* ✅ Swagger activo en `http://localhost:5001/api` para probar todo visualmente

---

### 🛠️ Requisitos

* Node.js v18 (usa `nvm`)
* MongoDB (local o Docker)

---

### ⚙️ Cómo levantarlo en local

Primero clona o descarga este proyecto y entra a la carpeta:

```bash
cd backend
npm install
```

#### 1. Asegúrate de tener MongoDB corriendo

La forma más rápida si no tienes Mongo instalado es con Docker:

```bash
docker run -d \
  --name local-mongo \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo
```

Eso te deja Mongo listo en `mongodb://localhost:27017`.

#### 2. Corre NestJS en modo desarrollo

```bash
npm run start:dev
```

Verás en consola:

```
Nest application successfully started
```

---

### 🧪 Swagger para probar la API

Podés abrir esta URL en tu navegador:

📍 [http://localhost:5001/api](http://localhost:5001/api)

Ahí podés ver la documentación y probar directamente los endpoints sin necesidad de Postman.

---

### 📤 Crear productos

Ejemplo de JSON para crear producto:

```json
{
  "name": "Camiseta NestJS",
  "price": 49.99,
  "image": "https://nestjs.com/img/logo-small.svg"
}
```

