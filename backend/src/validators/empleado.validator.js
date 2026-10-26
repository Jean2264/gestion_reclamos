export function validarDatosEmpleado(datos) {
  const errores = {};

  const camposObligatorios = [
    "nombre",
    "apellido",
    "dni",
    "telefono",
    "email",
    "calle",
    "numero",
    "localidad",
    "codigoPostal",
    "id_rol",
  ];

  for (const campo of camposObligatorios) {
    if (
      datos[campo] === undefined ||
      datos[campo] === null ||
      String(datos[campo]).trim() === ""
    ) {
      errores[campo] = "Este campo es obligatorio";
    }
  }

  if (datos.nombre) {
    if (
      !/^[\p{L}\s'-]+$/u.test(datos.nombre.trim()) ||
      datos.nombre.trim().length > 100
    ) {
      errores.nombre = "El nombre no es válido";
    }
  }

  if (datos.apellido) {
    if (
      !/^[\p{L}\s'-]+$/u.test(datos.apellido.trim()) ||
      datos.apellido.trim().length > 100
    ) {
      errores.apellido = "El apellido no es válido";
    }
  }

  if (datos.dni !== undefined && datos.dni !== null) {
    const dni = String(datos.dni).trim();

    if (!/^\d{8}$/.test(dni)) {
      errores.dni = "El DNI debe contener exactamente 8 dígitos";
    }
  }

  if (datos.telefono) {
    const digitos = String(datos.telefono).replace(/\D/g, "");

    if (digitos.length < 8 || digitos.length > 15) {
      errores.telefono = "El teléfono debe contener entre 8 y 15 dígitos";
    }
  }

  if (datos.email !== undefined && datos.email !== null) {
    const email = String(datos.email).trim();

    if (email.length > 50 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errores.email = "Ingresá un email válido de hasta 50 caracteres";
    }
  }

  if (datos.calle && String(datos.calle).trim().length > 20) {
    errores.calle = "La calle no puede superar los 20 caracteres";
  }

  if (datos.numero && String(datos.numero).trim().length > 20) {
    errores.numero = "El número no puede superar los 20 caracteres";
  }

  if (
    datos.localidad &&
    !["alejandro-korn", "san-vicente", "domselaar"].includes(
      String(datos.localidad).trim(),
    )
  ) {
    errores.localidad = "Seleccioná una localidad válida";
  }

  const codigosPostales = {
    "alejandro-korn": "1864",
    "san-vicente": "1865",
    domselaar: "1984",
  };

  if (
    datos.localidad &&
    datos.codigoPostal &&
    codigosPostales[String(datos.localidad).trim()] !==
      String(datos.codigoPostal).trim()
  ) {
    errores.codigoPostal =
      "El código postal no coincide con la localidad seleccionada";
  }

  if (
    datos.id_rol !== undefined &&
    datos.id_rol !== null &&
    ![1, 2].includes(Number(datos.id_rol))
  ) {
    errores.id_rol = "Seleccioná un rol válido";
  }

  if (Object.keys(errores).length > 0) {
    const error = new Error("Hay campos inválidos");
    error.statusCode = 400;
    error.details = errores;
    throw error;
  }
}
