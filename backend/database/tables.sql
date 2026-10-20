CREATE TABLE rol_usuario(
id_rol SERIAL PRIMARY KEY,
nombre_rol VARCHAR(40) NOT NULL,
descripcion VARCHAR(100)
)

SELECT id_rol, nombre_rol
FROM rol_usuario
ORDER BY id_rol;

insert into rol_usuario(
nombre_rol,
descripcion
) values ('Empleado', 'el chamba')

INSERT INTO rol_usuario (nombre_rol, descripcion)
VALUES ('Ciudadano', 'Usuario ciudadano del sistema');
INSERT INTO rol_usuario (nombre_rol, descripcion)
VALUES ('Ciudadano', 'Usuario ciudadano del sistema');

select * from rol_usuario
select * from localidad
CREATE TABLE usuario(
id_usuario SERIAL PRIMARY KEY,
email VARCHAR(50) NOT NULL UNIQUE,
contrasenia VARCHAR(50) NOT NULL,
id_rol INTEGER NOT NULL

)

select * from usuario
//creo los usuarios de prueba
INSERT INTO usuario (email, contrasenia, id_rol)
VALUES
    ('admin@prueba.com', 'PEGAR_HASH_ADMIN_AQUI', 1),
    ('empleado@prueba.com', 'PEGAR_HASH_EMPLEADO_AQUI', 2)
	delete from usuario where email='admin@prueba.com'


SELECT
    u.id_usuario,
    u.email,
    u.id_rol,
    r.nombre_rol
FROM usuario u
JOIN rol_usuario r ON r.id_rol = u.id_rol
WHERE u.email IN (
    'admin@prueba.com',
    'empleado@prueba.com'
)
ORDER BY u.id_rol;
	

ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_rol_usuario
FOREIGN KEY (id_rol) REFERENCES rol_usuario(id_rol)

ALTER TABLE usuario
ALTER COLUMN contrasenia TYPE VARCHAR(255);

CREATE TABLE ciudadano
(
id_ciudadano SERIAL PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
dni VARCHAR(8) NOT NULL UNIQUE,
telefono VARCHAR(30) NOT NULL,
fecha_nacimiento TIMESTAMP NOT NULL,
calle VARCHAR(20) NOT NULL,
numero VARCHAR(20) NOT NULL,
localidad VARCHAR(50) NOT NULL,
codigo_postal VARCHAR(20) NOT NULL,
id_usuario INTEGER UNIQUE
)

select * from ciudadano



ALTER TABLE ciudadano
ADD CONSTRAINT fk_ciudadano_usuario
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)



CREATE TABLE empleado_municipal(
id_empleado SERIAL PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
dni VARCHAR(8) NOT NULL UNIQUE,
telefono VARCHAR(8) NOT NULL,
calle VARCHAR(20) NOT NULL,
numero VARCHAR(20) NOT NULL,
localidad VARCHAR(50) NOT NULL,
codigo_postal VARCHAR(20) NOT NULL,
empleado BOOLEAN default TRUE,
id_usuario INTEGER UNIQUE,
CONSTRAINT fk_empleado_usuario
foreign key(id_usuario) references usuario(id_usuario)
)

select * from empleado_municipal

ALTER TABLE empleado_municipal
ALTER COLUMN telefono TYPE VARCHAR(30);

CREATE TABLE area_gestion 
(
    id_area SERIAL PRIMARY KEY,
    nombre_area VARCHAR (50) NOT NULL,
    descripcion VARCHAR (200)
)

INSERT INTO area_gestion (nombre_area, descripcion)
VALUES
    ('Alumbrado Público / Luminaria', 'Reclamos por luminarias apagadas, dañadas o con fallas en el alumbrado público.'),
    ('Pavimentación', 'Reclamos relacionados con calles, pavimento deteriorado y necesidades de pavimentación.'),
    ('Abovedado con Zanjeo', 'Reclamos por trabajos de abovedado, zanjeo y mantenimiento de calles y cunetas.'),
    ('Recolección de Residuos', 'Reclamos por falta de recolección de residuos o problemas con el servicio.'),
    ('Recolección de Ramas', 'Reclamos por falta de retiro de ramas y restos de poda.'),
    ('Poda de Arbustos', 'Reclamos relacionados con poda y mantenimiento de arbustos en espacios públicos.'),
    ('Otros', 'Reclamos que no corresponden a ninguna de las áreas específicas disponibles.');

select * from area_gestion
order by id_area

CREATE TABLE estado_reclamo(
id_estado SERIAL PRIMARY KEY,
nombre_estado varchar(50) not null,
descripcion varchar(200)
)


select * from estado_reclamo


CREATE TABLE reclamo(
id_reclamo SERIAL PRIMARY KEY,
fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
calle VARCHAR(20) NOT NULL,
altura varchar(20) not null,

localidad VARCHAR(50) not null,
codigo_postal VARCHAR(20) NOT NULL,
detalle_reclamo text not null,
estado_tributario boolean,
id_ciudadano integer unique,
id_area integer,
id_estado integer,
constraint fk_reclamo_ciudadano
foreign key(id_ciudadano) references ciudadano(id_ciudadano),

constraint fk_reclamo_area
foreign key(id_area) references area_gestion(id_area),

constraint fk_reclamo_estado
foreign key(id_estado) references estado_reclamo(id_estado)
)

ALTER TABLE reclamo
DROP CONSTRAINT IF EXISTS fk_reclamo_ciudadano;

ALTER TABLE reclamo
DROP CONSTRAINT IF EXISTS reclamo_id_ciudadano_key;

ALTER TABLE reclamo
ALTER COLUMN id_ciudadano SET NOT NULL;

ALTER TABLE reclamo
ADD CONSTRAINT fk_reclamo_ciudadano
FOREIGN KEY (id_ciudadano)
REFERENCES ciudadano(id_ciudadano);

CREATE TABLE historico_reclamo(
id_historial serial primary key,
fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
estado varchar(50) not null,
resolucion varchar(200),
id_reclamo integer unique ,
constraint fk_historico_reclamo
foreign key (id_reclamo) references reclamo(id_reclamo),
id_empleado integer,
constraint fk_historico_empleado
foreign key (id_empleado) references empleado_municipal(id_empleado)
)

ALTER TABLE historico_reclamo
DROP CONSTRAINT IF EXISTS historico_reclamo_id_reclamo_key;


CREATE TABLE imagen_reclamo(
id_imagen serial primary key,
imagen_url text,
id_reclamo integer unique ,
constraint fk_imagen_reclamo
foreign key (id_reclamo) references reclamo(id_reclamo)

)


ALTER TABLE imagen_reclamo
DROP CONSTRAINT IF EXISTS imagen_reclamo_id_reclamo_key;