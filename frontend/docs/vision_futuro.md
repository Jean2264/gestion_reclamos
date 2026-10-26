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
