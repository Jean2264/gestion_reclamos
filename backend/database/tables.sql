-- ==========================================
-- TABLA EMPRESA
-- ==========================================

CREATE TABLE Empresa
(
	IdEmpresa SERIAL PRIMARY KEY,
	Nombre VARCHAR(150) NOT NULL,
	Email VARCHAR(255) NOT NULL,
	Telefono VARCHAR(30) ,
	Direccion VARCHAR(255),
	Slug VARCHAR(150) NOT NULL,
	Estado BOOLEAN NOT NULL DEFAULT TRUE,

	FechaAlta TIMESTAMP NOT NULL DEFAULT 
	CURRENT_TIMESTAMP,

	CONSTRAINT UQ_Empresa_Slug UNIQUE (Slug)
)

INSERT INTO Empresa
(
    Nombre,
    Email,
    Telefono,
    Direccion,
    Slug
)
VALUES
(
    'Melco Tatoo',
    'melco@gmail.com',
    '1122334455',
    'Alejandro Korn',
    'melco-tatoo'
),
(
    'Barbería 48',
    'barberia48@gmail.com',
    '1166778899',
    'San Vicente',
    'barberia-48'
);


SELECT * FROM Empresa;



-- ==========================================
-- TABLA EMPRESAIMAGEN
-- ==========================================

CREATE TABLE EmpresaImagen
(
    IdEmpresaImagen SERIAL PRIMARY KEY,

    Url TEXT NOT NULL,

    Orden INTEGER NOT NULL,

    Estado BOOLEAN NOT NULL DEFAULT TRUE,

    FechaAlta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    IdEmpresa INTEGER NOT NULL,

    CONSTRAINT FK_EmpresaImagen_Empresa
        FOREIGN KEY (IdEmpresa)
        REFERENCES Empresa(IdEmpresa)
);
-- ==========================================
-- TABLA USUARIO
-- ==========================================

CREATE TABLE Usuario
(
    IdUsuario SERIAL PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
	CuentaActivada BOOLEAN NOT NULL DEFAULT FALSE,
    FechaAlta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

alter table Usuario 
add column TokenActivacionHash varchar(255),
add column TokenActivacionExpiraEn TIMESTAMP



SELECT
  "idusuario",
  "email",
  "cuentaactivada",
  "tokenactivacionhash",
  "tokenactivacionexpiraen"
FROM "usuario"
WHERE "idusuario" = 24;


UPDATE Usuario
SET CuentaActivada = TRUE
WHERE Email = 'jean@gmail.com';

-- ==========================================
-- TABLA ROL
-- ==========================================

CREATE TABLE Rol
(
    IdRol SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Datos iniciales

INSERT INTO Rol (Nombre)
VALUES
('Administrador'),
('Barbero'),
('Recepcionista');

-- ==========================================
-- TABLA EMPLEADO
-- ==========================================

CREATE TABLE Empleado
(
    IdEmpleado SERIAL PRIMARY KEY,

    UsuarioId INTEGER UNIQUE,

    IdRol INTEGER NOT NULL,

    DNI VARCHAR(8) NOT NULL UNIQUE,

    Nombre VARCHAR(100) NOT NULL,

    Apellido VARCHAR(100) NOT NULL,

    Telefono VARCHAR(30),

    Experiencia TEXT,

    Foto VARCHAR(255),

    Estado BOOLEAN NOT NULL DEFAULT TRUE,

    FechaAlta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Empleado_Usuario
        FOREIGN KEY (UsuarioId)
        REFERENCES Usuario(IdUsuario),

    CONSTRAINT FK_Empleado_Rol
        FOREIGN KEY (IdRol)
        REFERENCES Rol(IdRol)
);


SELECT
    conname,
    pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'empleado'::regclass;


ALTER TABLE Empleado
ADD COLUMN IdEmpresa INTEGER;

ALTER TABLE Empleado
ADD CONSTRAINT FK_Empleado_Empresa
    FOREIGN KEY (IdEmpresa)
    REFERENCES Empresa(IdEmpresa);

	UPDATE Empleado
SET IdEmpresa = 2
WHERE IdEmpresa IS NULL;


SELECT
    e.IdEmpleado,
    e.UsuarioId,
    e.IdEmpresa,
    em.Nombre AS Empresa,
    e.DNI,
    e.Nombre,
    e.Apellido,
    e.IdRol
FROM Empleado e
INNER JOIN Empresa em
    ON e.IdEmpresa = em.IdEmpresa;


ALTER TABLE Empleado
DROP CONSTRAINT empleado_usuarioid_key;

ALTER TABLE Empleado
DROP CONSTRAINT empleado_dni_key;

ALTER TABLE Empleado
ADD CONSTRAINT UQ_Empleado_Empresa_UsuarioId
UNIQUE (IdEmpresa, UsuarioId);

ALTER TABLE Empleado
ADD CONSTRAINT UQ_Empleado_Empresa_DNI
UNIQUE (IdEmpresa, DNI);
	
	SELECT *
FROM Empleado;


-- ==========================================
-- TABLA eMPLEADO/SERVICIO
-- ==========================================
CREATE TABLE EmpleadoServicio
(
    EmpleadoId INTEGER NOT NULL,
    ServicioId INTEGER NOT NULL,

    PRIMARY KEY (EmpleadoId, ServicioId),

    CONSTRAINT FK_EmpleadoServicio_Empleado
        FOREIGN KEY (EmpleadoId)
        REFERENCES Empleado(IdEmpleado),

    CONSTRAINT FK_EmpleadoServicio_Servicio
        FOREIGN KEY (ServicioId)
        REFERENCES Servicio(IdServicio)
);



-- ==========================================
-- TABLA SERVICIO
-- ==========================================

CREATE TABLE Servicio
(
	IdServicio SERIAL PRIMARY KEY,
	Nombre VARCHAR(100) NOT NULL,
	Descripcion VARCHAR(200),
	Costo DECIMAL(10,2) NOT NULL,
	Foto VARCHAR(255),
	Estado BOOLEAN NOT NULL DEFAULT TRUE,
	Duracion INTERVAL NOT NULL,
	FechaAlta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
ALTER TABLE Servicio
add COLUMN CodServicio varchar(8) UNIQUE;
delete  from Servicio


ALTER TABLE Servicio
ADD COLUMN IdEmpresa INTEGER;


ALTER TABLE Servicio ADD CONSTRAINT
FK_Servicio_Empresa
 FOREIGN KEY(IdEmpresa)
 references Empresa(IdEmpresa);


UPDATE Servicio
SET IdEmpresa = 2
WHERE IdEmpresa IS NULL;

SELECT
    s.IdServicio,
    s.Nombre,
    s.Costo,
    s.IdEmpresa,
    e.Nombre AS Empresa
FROM Servicio s
INNER JOIN Empresa e
    ON s.IdEmpresa = e.IdEmpresa;

SELECT *
FROM Servicio;



SELECT *
FROM EmpleadoServicio;
-- ==========================================
-- TABLA CLIENTE
-- ==========================================

CREATE TABLE Cliente
(
    IdCliente SERIAL PRIMARY KEY,

    UsuarioId INTEGER UNIQUE,

    DNI VARCHAR(8) NOT NULL UNIQUE,

    Nombre VARCHAR(100) NOT NULL,

    Apellido VARCHAR(100) NOT NULL,

    Telefono VARCHAR(30),

    Foto VARCHAR(255),

    Estado BOOLEAN NOT NULL DEFAULT TRUE,

    FechaAlta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Cliente_Usuario
        FOREIGN KEY (UsuarioId)
        REFERENCES Usuario(IdUsuario)
);

ALTER TABLE Cliente
ADD COLUMN IdEmpresa INTEGER;


ALTER TABLE Cliente ADD CONSTRAINT
FK_Cliente_Empresa
 FOREIGN KEY(IdEmpresa)
 references Empresa(IdEmpresa);


 UPDATE Cliente
 SET IdEmpresa= 1
 Where IdCliente=1;



 SELECT
    c.IdCliente,
    c.UsuarioId,
    c.IdEmpresa,
    e.Nombre AS Empresa,
    c.DNI,
    c.Nombre,
    c.Apellido
FROM Cliente c
INNER JOIN Empresa e
    ON c.IdEmpresa = e.IdEmpresa;


	SELECT 
	 conname,
	 pg_get_constraintdef(oid)
	FROM pg_constraint
	WHERE conrelid = 'cliente'::regclass;

	alter table Cliente
	drop constraint cliente_usuarioid_key;

alter table Cliente
add constraint UQ_Cliente_Empresa_UsuarioId
unique (IdEmpresa, UsuarioId);
	

	
SELECT * FROM Cliente



--===========================

INSERT INTO Usuario
(
    Email,
    PasswordHash
)
VALUES
(
    'jean@gmail.com',
    '123456'
);

INSERT INTO Cliente
(
    UsuarioId,
    DNI,
    Nombre,
    Apellido,
    Telefono
)
VALUES
(
    1,
    '12345678',
    'Jean',
    'Paiva',
    '1122334455'
);

select * from Usuario
select * from Empleado
select * from Servicio
---delete  from Empleado
--delete from Usuario WHERE IdUsuario>1
--update Usuario set Estado= true WHERE IdUsuario=1
select * from Cliente

-- 1. Primero borrás los registros de la tabla hija ("empleado")
--DELETE FROM "empleado" 
--WHERE "usuarioid" > 1;

-- 2. Ahora sí borrás los registros de la tabla padre ("usuario")
--DELETE FROM "usuario" 
--WHERE "idusuario" > 1;

update Empleado
Set Estado= True WHERE IdEmpleado=13