# Proyecto Backend con integración de API KEY

Este proyecto sirve de ejemplo para mostrar la integración de peticiones a `endpoints` que requieren la gestión de una `API KEY`, o `TOKEN`.

## Cómo ejecutarlo

1. Tener instalado NODE JS.
2. Abrir el proyecto con VS CODE, arrastrando la carpeta de éste al IDE.
3. Una vez abierto el proyecto, desde una ventana `Terminal` ejecutar el comando:
```bash
/> npm install
```
Si trabajas en `Linux` o `MacOS`, antepone el comando `sudo`, e ingresa tu contraseña cuando te la solicite.

```bash
/> sudo npm install
```

4. Finalizada la instalación de las herramientas anteriores, limpia la ventana `Terminal` con el comando `clear` en Linux o MacOS, o el comando `cls` desde Windows.

5. Ejecuta el proyecto mediante:
```bash
/> npm run prod
```

## Ingresar a los endpoints:

El endpoint principal de la aplicación es:
```
GET http://localhost:3008/
```

El endpoint para gestionar tokens mediante la asignación por usuarios, es:

```
POST http://localhost:3008/register
```

En el cuerpo de la petición, envia:

```json
{
    "username": "Nombre o Nickname."
}
```

Te dará una respuesta similar a la siguiente:
```json
{
    "message": "Token asignado al usuario: {USUARIO} - token: 232ac59dd7274fe3bf6b898d0fff215c."
}
```

Copia el código alfanumérico correspondiente al token que te dió la aplicación, para usarlo en las otras peticiones. **No reinicies la aplicación. Si lo haces, deberás generar un token nuevamente.**

### Endpoint /productos
El endpoint de productos de la aplicación es:
```
GET http://localhost:3008/productos 
```

**Authorization**

```
    Auth Type: API Key
    Key:       token
    Value:     `código alfanumérico del token generado`
    Add to:    Header
```

Si valida el token correctamente, verás el  listado de productos, sino, dará un error del tipo `403
Forbidden`.


### Endpoint /productos/categorias/:cat

```
GET http://localhost:3008/productos/categorias/:cat
```

En este endpoint, podrás obtener un listado de productos, filtrando por una categoría específica, mediante el uso de `URL PARAMS`.

Debes enviar también la información de API Key correspondiente, para poder acceder a los datos.

### Endpoint /categorias

```
GET http://localhost:3008/categorias
```

Este endpoint te retorna un listado de todas las categorías unívocas relacionadas a los productos de ecommerce.

Debes enviar también la información de API Key correspondiente, para poder acceder a los datos.