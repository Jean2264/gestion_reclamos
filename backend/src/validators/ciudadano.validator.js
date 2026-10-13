export function validarDatosCiudadano(datos) {
  const errores = {};

  const camposObligatorios = [
    "nombre",
    "apellido",
    "telefono",
    "fechaNacimiento",
    "calle",
    "numero",
    "localidad",
    "codigoPostal",
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

  if (datos.nombre && !/^[\p{L}\s'-]+$/u.test(datos.nombre.trim())) {
    errores.nombre = "El nombre contiene caracteres inválidos";
  }

  if (datos.apellido && !/^[\p{L}\s'-]+$/u.test(datos.apellido.trim())) {
    errores.apellido = "El apellido contiene caracteres inválidos";
  }

  if (datos.telefono) {
    const digitos = datos.telefono.replace(/\D/g, "");

    if (digitos.length < 8 || digitos.length > 15) {
      errores.telefono = "El teléfono debe contener entre 8 y 15 dígitos";
    }
  }

  if (datos.fechaNacimiento) {
    const fecha = new Date(`${datos.fechaNacimiento}T00:00:00`);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(datos.fechaNacimiento) ||
      Number.isNaN(fecha.getTime()) ||
      fecha.toISOString().slice(0, 10) !== datos.fechaNacimiento
    ) {
      errores.fechaNacimiento = "La fecha no es válida";
    } else {
      const hoy = new Date();
      const fechaLimite = new Date(
        hoy.getFullYear() - 18,
        hoy.getMonth(),
        hoy.getDate(),
      );

      if (fecha > fechaLimite) {
        errores.fechaNacimiento = "Debés tener al menos 18 años";
      }
    }
  }

  if (
    datos.codigoPostal &&
    !/^[a-zA-Z0-9\s-]{3,10}$/.test(datos.codigoPostal.trim())
  ) {
    errores.codigoPostal = "El código postal no es válido";
  }

  if (Object.keys(errores).length > 0) {
    const error = new Error("Hay campos inválidos");
    error.statusCode = 400;
    error.details = errores;
    throw error;
  }
}
