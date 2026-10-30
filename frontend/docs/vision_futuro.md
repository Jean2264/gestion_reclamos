# agregarFuturo

a futuro queremos agregar un cartel de alerta o exito al crear un usuario (para mantener visualizacion del estado)

# ESTADOS

-nuevo
-asignado

- en proceso
  -finalizado (con detalle del porque)

evangelina, descargar en las carpetas backend y frontend (en ambos por separado, y sin las comillas ):

`npm install browser-image-compression`

es para el manejo de imagenes

agregue lo siguente: imagenes como maximo 2, tamaño maximo de cada uno 0,2 o sea 2mb, asi los dos juntos serian 4MB,
si el ciudadano llega a ingresar una imagen con tamaño >5MB, lo rechazamos y le pedimos que ingrese una imagen de tamaño menor y cuando ingrese la imagen verificamos si su tamanio > 2MB y lo comprimimos, por si algun bichito de luz quiera ingresar uno con 50MB de tamanio.

# id de roles

1 ----- admin
2 ----- empleado
3 ----- ciudadano

## ...

tambien por las dudas en el back: `npm install multer`

# Evangelina (no voy a intentar escribir tu apellido)

## tener que hacer esto en ld db

ALTER TABLE reclamo
ADD COLUMN codigo_reclamo VARCHAR(20) UNIQUE;

ALTER TABLE reclamo
DROP CONSTRAINT reclamo_id_ciudadano_key;

# dentro del front

instalar : npm install jspdf
para pdf

# CODIGO DE TOKEN DE PASSWORD

const codigoEsperado = "482731";

## Agregar este campo a la tabla de usuario

ALTER TABLE usuario
ADD COLUMN debe_cambiar_contrasenia BOOLEAN NOT NULL DEFAULT FALSE;

### Es para el tema de primer login

## Agregar estado_reclamo = en proceso (asi como lo puse)

nos olvidamos de vuelta ajajaj

# Para ejecutar

npm run dev -- --host 0.0.0.0

````
¿Qué hace --host 0.0.0.0?

Le indica a Vite que escuche conexiones por las interfaces de red de tu computadora, en lugar de aceptar solamente conexiones locales.

Sin esa configuración, es posible que el celular no pueda acceder al frontend.```
````

## Resultado ejemplo:

VITE ready

Local: http://localhost:5173/
Network: http://192.168.1.50:5173/

## Los profesores deberan usar o sea el cliente es el que dice NetWork

¿Tengo que cambiar algo en el proyecto?
Si querés dejarlo configurado permanentemente durante el desarrollo, podés modificar el script de package.json:

````js
{
  "scripts": {
    "dev": "vite --host 0.0.0.0"
  }
}```
````
