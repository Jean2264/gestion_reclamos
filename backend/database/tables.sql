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

CREATE TABLE usuario(
id_usuario SERIAL PRIMARY KEY,
email VARCHAR(50) NOT NULL UNIQUE,
contrasenia VARCHAR(50) NOT NULL,
id_rol INTEGER NOT NULL

)

ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_rol_usuario
FOREIGN KEY (id_rol) REFERENCES rol_usuario(id_rol)

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
id_usuario INTEGER
)

ALTER TABLE ciudadano
ADD CONSTRAINT uq_ciudadano_usuario
UNIQUE (id_usuario);

ALTER TABLE ciudadano
ADD CONSTRAINT fk_ciudadano_usuario
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)