CREATE TABLE rol_usuario(
id_rol SERIAL PRIMARY KEY,
nombre_rol VARCHAR(40) NOT NULL,
descripcion VARCHAR(100)
)

insert into rol_usuario(
nombre_rol,
descripcion
) values ('Empleado', 'el chamba')

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


CREATE TABLE area_gestion 
(
    id_area SERIAL PRIMARY KEY,
    nombre_area VARCHAR (50) NOT NULL,
    descripcion VARCHAR (200)
)

select * from area_gestion


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


CREATE TABLE imagen_reclamo(
id_imagen serial primary key,
imagen_url text,
id_reclamo integer unique ,
constraint fk_imagen_reclamo
foreign key (id_reclamo) references reclamo(id_reclamo)

)