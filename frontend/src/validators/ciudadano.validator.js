export function validarPerfil(datos) {
  const errores = {};

  // 1. Campos obligatorios
  const camposObligatorios = [
    "nombre",
    "apellido",
    "fechaNacimiento",
    "telefono",
    "calle",
    "numero",
    "localidad",
    "codigoPostal",
    "email",
  ];

  for (const campo of camposObligatorios) {
    if (typeof datos[campo] !== "string" || datos[campo].trim() === "") {
      errores[campo] = "Este campo es obligatorio";
    }
  }

  // 2. Nombre y apellido
  const regexNombre = /^[\p{L}\s'-]+$/u;

  if (datos.nombre?.trim() && !regexNombre.test(datos.nombre.trim())) {
    errores.nombre = "El nombre contiene caracteres inválidos";
  }

  if (datos.apellido?.trim() && !regexNombre.test(datos.apellido.trim())) {
    errores.apellido = "El apellido contiene caracteres inválidos";
  }

  // 3. Email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (datos.email?.trim() && !regexEmail.test(datos.email.trim())) {
    errores.email = "Ingresá un email válido";
  }

  // 4. Teléfono: entre 8 y 15 dígitos
  if (datos.telefono?.trim()) {
    const digitos = datos.telefono.replace(/\D/g, "");

    if (digitos.length < 8 || digitos.length > 15) {
      errores.telefono = "Debe contener entre 8 y 15 dígitos";
    }
  }

  // 5. Fecha de nacimiento
  if (datos.fechaNacimiento?.trim()) {
    const fecha = datos.fechaNacimiento;
    const fechaObjeto = new Date(`${fecha}T00:00:00`);

    const fechaValida =
      /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
      !Number.isNaN(fechaObjeto.getTime()) &&
      fechaObjeto.toISOString().slice(0, 10) === fecha;

    if (!fechaValida) {
      errores.fechaNacimiento = "La fecha no es válida";
    } else {
      const hoy = new Date();

      const fechaLimite = new Date(
        hoy.getFullYear() - 18,
        hoy.getMonth(),
        hoy.getDate(),
      );

      if (fechaObjeto > fechaLimite) {
        errores.fechaNacimiento = "Debés tener al menos 18 años";
      }
    }
  }

  // 6. Código postal
  if (
    datos.codigoPostal?.trim() &&
    !/^[a-zA-Z0-9\s-]{3,10}$/.test(datos.codigoPostal.trim())
  ) {
    errores.codigoPostal = "El código postal no es válido";
  }

  return errores;
}
