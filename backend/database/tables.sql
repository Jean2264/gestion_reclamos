
-- =====================================================
-- 1. ROLES DE USUARIO
-- =====================================================

CREATE TABLE rol_usuario (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(40) NOT NULL UNIQUE,
    descripcion VARCHAR(100)
);

INSERT INTO rol_usuario (nombre_rol, descripcion)
VALUES
    ('Administrador', 'Administrador del sistema'),
    ('Empleado', 'Personal municipal'),
    ('Ciudadano', 'Usuario ciudadano del sistema');

select * from rol_usuario
-- =====================================================
-- 2. USUARIOS
-- =====================================================

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
	debe_cambiar_contrasenia BOOLEAN NOT NULL DEFAULT FALSE,
    id_rol INTEGER NOT NULL,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol_usuario(id_rol)
);


-- =====================================================
-- 3. CIUDADANOS
-- =====================================================

CREATE TABLE ciudadano (
    id_ciudadano SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(8) NOT NULL UNIQUE,
    telefono VARCHAR(30) NOT NULL,
    fecha_nacimiento TIMESTAMP NOT NULL,
    calle VARCHAR(20) NOT NULL,
	estado boolean default true,
    numero VARCHAR(20) NOT NULL,
    localidad VARCHAR(50) NOT NULL,
    codigo_postal VARCHAR(20) NOT NULL,
    id_usuario INTEGER UNIQUE,

    CONSTRAINT fk_ciudadano_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

select * from ciudadano where codigo_postal= 'romina@gmail.com'


-- =====================================================
-- 4. EMPLEADOS MUNICIPALES
-- =====================================================

CREATE TABLE empleado_municipal (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(8) NOT NULL UNIQUE,
    telefono VARCHAR(30) NOT NULL,
    calle VARCHAR(20) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    localidad VARCHAR(50) NOT NULL,
    codigo_postal VARCHAR(20) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    id_usuario INTEGER UNIQUE,

    CONSTRAINT fk_empleado_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

select * from empleado_municipal

SELECT
    e.id_empleado,
    e.nombre,
    e.apellido,
    e.dni,
    e.estado,
    u.id_usuario,
    u.email,
    r.nombre_rol
FROM empleado_municipal e
LEFT JOIN usuario u
    ON u.id_usuario = e.id_usuario
LEFT JOIN rol_usuario r
    ON r.id_rol = u.id_rol
ORDER BY e.id_empleado;

-- =====================================================
-- 5. ÁREAS DE GESTIÓN
-- =====================================================

CREATE TABLE area_gestion (
    id_area SERIAL PRIMARY KEY,
    nombre_area VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200)
);

INSERT INTO area_gestion (nombre_area, descripcion)
VALUES
    (
        'Alumbrado Público / Luminaria',
        'Reclamos por luminarias apagadas, dañadas o con fallas.'
    ),
    (
        'Pavimentación',
        'Reclamos relacionados con calles y pavimento deteriorado.'
    ),
    (
        'Abovedado con Zanjeo',
        'Reclamos por zanjeo y mantenimiento de calles y cunetas.'
    ),
    (
        'Recolección de Residuos',
        'Reclamos por falta de recolección de residuos.'
    ),
    (
        'Recolección de Ramas',
        'Solicitudes de retiro de ramas y restos de poda.'
    ),
    (
        'Poda de Arbustos',
        'Solicitudes de poda y mantenimiento de arbustos.'
    ),
    (
        'Otros',
        'Incidencias generales no contempladas en otras áreas.'
    );


-- =====================================================
-- 6. ESTADOS DE RECLAMO
-- =====================================================

CREATE TABLE estado_reclamo (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200)
);
INSERT INTO estado_reclamo(nombre_estado)
values(
'Nuevo'
),
('asignado'),
('finalizado');

select * from estado_reclamo

-- =====================================================
-- 7. RECLAMOS
-- =====================================================

CREATE TABLE reclamo (
    id_reclamo SERIAL PRIMARY KEY,
    fecha_alta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    calle VARCHAR(20) NOT NULL,
	calle_uno VARCHAR(20) NOT NULL,
	calle_dos VARCHAR(20) NOT NULL,
    altura VARCHAR(20) NOT NULL,
    localidad VARCHAR(50) NOT NULL,
    codigo_postal VARCHAR(20) NOT NULL,
    detalle_reclamo TEXT NOT NULL,
    estado_tributario BOOLEAN,
	numero_partida varchar(20) not null,
    id_ciudadano INTEGER NOT NULL UNIQUE,
    id_area INTEGER,
    id_estado INTEGER,

    CONSTRAINT fk_reclamo_ciudadano
        FOREIGN KEY (id_ciudadano)
        REFERENCES ciudadano(id_ciudadano),

    CONSTRAINT fk_reclamo_area
        FOREIGN KEY (id_area)
        REFERENCES area_gestion(id_area),

    CONSTRAINT fk_reclamo_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado_reclamo(id_estado)
);


ALTER TABLE reclamo
ADD COLUMN codigo_reclamo VARCHAR(20) UNIQUE;

ALTER TABLE reclamo
DROP CONSTRAINT reclamo_id_ciudadano_key;

update reclamo
set id_estado= '2' where id_reclamo='6'
select * from reclamo
-- =====================================================
-- 8. HISTORIAL DE RECLAMOS
-- =====================================================

CREATE TABLE historico_reclamo (
    id_historial SERIAL PRIMARY KEY,
    fecha_alta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) NOT NULL,
    resolucion VARCHAR(200),
    id_reclamo INTEGER NOT NULL,
    id_empleado INTEGER,

    CONSTRAINT fk_historico_reclamo
        FOREIGN KEY (id_reclamo)
        REFERENCES reclamo(id_reclamo),

    CONSTRAINT fk_historico_empleado
        FOREIGN KEY (id_empleado)
        REFERENCES empleado_municipal(id_empleado)
);


-- =====================================================
-- 9. IMÁGENES DE RECLAMOS
-- =====================================================

CREATE TABLE imagen_reclamo (
    id_imagen SERIAL PRIMARY KEY,
    imagen_url TEXT,
    id_reclamo INTEGER NOT NULL,

    CONSTRAINT fk_imagen_reclamo
        FOREIGN KEY (id_reclamo)
        REFERENCES reclamo(id_reclamo)
);



