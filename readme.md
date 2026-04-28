# API REST - Backend TECLAB

Les damos la documentación de la API REST de TECLAB.
Esta API permite gestionar usuarios, productos y categorías utilizando autenticación basada en tokens.

## Autenticación

La API utiliza dos tipos de tokens:

* __admintoken__ → Para endpoints administrativos
* __usertoken__ → Para operaciones de usuario

Debes enviar el token en los headers de cada request:

__Headers:__
* usertoken: `TU_TOKEN`
* admintoken: `TU_TOKEN_ADMIN`
* Endpoint Base `GET /`

Obtiene información general de la API.

✅ Respuesta exitosa

```bash
{
  "message": "Bienvenid@s a nuestra API Backend de TECLAB.",
  "APIName": "Ejemplo con API KEY - Teclab 2026",
  "copyright": "Fernando Omar Luna",
  "version": "1.0.2026"
}
```

## Usuarios

🔹 Registrar usuario

```bash 
POST /register
```

Crea un nuevo usuario y genera un token.

__Body__
```bash
{
  "email": "usuario@email.com",
  "nickname": "usuario123"
}
````

__Respuesta__

```bash
{
  "id": "abc123",
  "email": "usuario@email.com",
  "nickname": "usuario123",
  "tokenId": "TOKEN_GENERADO"
}
```

🔹 Listar todos los usuarios (Admin)

```bash 
POST /list-all-users
```

__Headers__

__admintoken__: `TOKEN_ADMIN`

__Respuesta__

```bash
[
  {
    "id": "abc123",
    "email": "usuario@email.com",
    "nickname": "usuario123"
  }
]
```

## Productos
🔹 Obtener todos los productos

```bash 
GET /productos
```


__Headers__

__usertoken__: `TOKEN_USUARIO`

__Respuesta__
```bash
[
  {
    "id": "prod1",
    "nombre": "Producto 1",
    "precio": 100,
    "categoria": "Tecnologia",
    "imagen": "url_imagen"
  }
]
````

🔹 Obtener producto por ID

```bash 
GET /productos/:id
```

__ Headers__

__usertoken__: `TOKEN_USUARIO`

__Parámetros__

`id: ID del producto`

__Respuesta__

```bash
{
  "id": "prod1",
  "nombre": "Producto 1",
  "precio": 100,
  "categoria": "Tecnologia",
  "imagen": "url_imagen"
}
````

🔹 Crear producto

```bash 
POST /productos
```

__Headers__

__usertoken__: `TOKEN_USUARIO`

__Body__

```bash
{
  "nombre": "Nuevo Producto",
  "precio": 200,
  "imagen": "url_imagen",
  "categoria": "Tecnologia"
}
````

__Respuesta__

```bash
{
  "id": "nuevo_id",
  "nombre": "Nuevo Producto",
  "precio": 200,
  "imagen": "url_imagen",
  "categoria": "Tecnologia"
}
````

🔹 Filtrar productos por categoría

```bash 
GET /productos/categorias/:cate
```

__Headers__

__usertoken__: `TOKEN_USUARIO`

__Parámetros__

`cate: nombre de la categoría`

__Ejemplo__

```bash 
GET /productos/categorias/tecnologia 
```

__Respuesta__

```bash
[
  {
    "id": "prod1",
    "nombre": "Producto 1",
    "categoria": "Tecnologia"
  }
]
````

## Categorías

🔹 Obtener todas las categorías

`GET /categorias`

__Headers__

__usertoken__: `TOKEN_USUARIO`

__Respuesta__

```bash
[
  {
    "id": "cat1",
    "nombre": "Tecnologia"
  }
]
```

# Manejo de errores

La API utiliza códigos HTTP estándar:
|-|-|
|Código|Descripción|
|-|-|
|200|OK|
|201|Creado correctamente|
|400|Error en la solicitud|
|401|No autorizado|
|404|No encontrado|
|500|Error del servidor|


__Ejemplo de error:__

```bash
{
  "message": "Error al obtener productos.",
  "errorMessage": "Detalle del error"
}
```

## Ejemplo con cURL

```curl
curl -X GET http://localhost:3000/productos \
  -H "usertoken: TU_TOKEN"
```

## Notas finales
* Todos los endpoints (excepto `/` y `/register`) requieren autenticación.
* Los tokens deben enviarse siempre en los headers.
* Las categorías se normalizan automáticamente (primera letra mayúscula).
