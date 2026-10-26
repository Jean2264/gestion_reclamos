const API_URL = "http://localhost:3000/api";

export async function iniciarSesion(email, contrasenia) {
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      contrasenia,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

//inicio sesion administrativo

export async function iniciarSesionAdmin(dni, contrasenia) {
  const response = await fetch(`${API_URL}/usuarios/login-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ dni, contrasenia }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión.");
  }

  return data;
}

export async function registrarUsuario(datosRegistro) {
  const response = await fetch(`${API_URL}/usuarios/registro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(datosRegistro),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function obtenerUsuarioActual() {
  const response = await fetch(`${API_URL}/usuarios/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function actualizarPassword(password) {
  const response = await fetch("http://localhost:3000/api/usuarios/password", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function actualizarPasswordPorEmail(email, password) {
  const response = await fetch(`${API_URL}/usuarios/password-email`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la contraseña.");
  }

  return data;
}

export async function cerrarSesion() {
  const response = await fetch(`${API_URL}/usuarios/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
