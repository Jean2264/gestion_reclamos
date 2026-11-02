const LOCALIDADES_VALIDAS = ["alejandro-korn", "san-vicente", "domselaar"];

export function validarPerfil(datos) {
  const errores = {};

  const camposObligatorios = [
    "nombre",
    "apellido",
    "telefono",
    "calle",
    "numero",
    "localidad",
    "email",
  ];

  // 1. Campos obligatorios
  for (const campo of camposObligatorios) {
    if (typeof datos[campo] !== "string" || datos[campo].trim() === "") {
      errores[campo] = "Este campo es obligatorio";
    }
  }

  // 2. Nombre y apellido
  const regexNombre = /^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u;

  for (const campo of ["nombre", "apellido"]) {
    const valor = datos[campo]?.trim();

    if (valor && !regexNombre.test(valor)) {
      errores[campo] =
        "Ingresá un nombre válido, sin números ni caracteres especiales";
    } else if (valor && valor.length > 100) {
      errores[campo] = "No puede superar los 100 caracteres";
    }
  }

  // 3. Email
  const email = datos.email?.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !regexEmail.test(email)) {
    errores.email = "Ingresá un email válido";
  } else if (email && email.length > 254) {
    errores.email = "El email es demasiado largo";
  }

  // 4. Teléfono
  // Permite números, un + inicial, espacios y guiones.
  const telefono = datos.telefono?.trim();

  if (telefono) {
    const regexTelefono = /^\+?[0-9]+(?:[ -][0-9]+)*$/;
    const cantidadDigitos = telefono.replace(/\D/g, "").length;

    if (!regexTelefono.test(telefono)) {
      errores.telefono =
        "Solo se permiten números, un + inicial, espacios y guiones";
    } else if (cantidadDigitos < 8 || cantidadDigitos > 15) {
      errores.telefono = "El teléfono debe contener entre 8 y 15 dígitos";
    }
  }

  // 5. Calle
  const calle = datos.calle?.trim();
  const regexCalle = /^[\p{L}\p{N} .,'\-]+$/u;

  if (calle && !regexCalle.test(calle)) {
    errores.calle = "La calle contiene caracteres inválidos";
  } else if (calle && calle.length > 100) {
    errores.calle = "La calle no puede superar los 100 caracteres";
  }

  // 6. Número de domicilio
  const numero = datos.numero?.trim();

  if (numero && !/^[\p{L}\p{N} -]+$/u.test(numero)) {
    errores.numero = "Ingresá un número de domicilio válido";
  } else if (numero && numero.length > 20) {
    errores.numero = "El número de domicilio es demasiado largo";
  }

  // 7. Localidad
  const localidad = datos.localidad?.trim().toLowerCase();

  if (localidad && !LOCALIDADES_VALIDAS.includes(localidad)) {
    errores.localidad = "Seleccioná una localidad válida";
  }

  // 8. Código postal, aunque sea de solo lectura
  const codigoPostal = datos.codigoPostal?.trim();

  if (codigoPostal && !/^[a-zA-Z0-9 -]{3,10}$/.test(codigoPostal)) {
    errores.codigoPostal = "El código postal no es válido";
  }

  return errores;
}
