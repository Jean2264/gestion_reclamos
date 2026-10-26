import { jsPDF } from "jspdf";

const MUNICIPIO = {
  nombre: "Municipalidad de San Vicente",
  sistema: "Sistema de Gestión de Reclamos",
  sitioWeb: "gestiondereclamos.com.ar",
  telefono: "0800-000-0000",
  logo: "/muni-muni.png",
  color: [36, 90, 67],
};

const obtener = (objeto, ...claves) => {
  for (const clave of claves) {
    if (objeto?.[clave] !== undefined && objeto[clave] !== null) {
      return objeto[clave];
    }
  }
  return "";
};

const cargarImagen = async (ruta) => {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) throw new Error("No se pudo cargar el logotipo");

  const blob = await respuesta.blob();

  return await new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = reject;
    lector.readAsDataURL(blob);
  });
};

export async function generarComprobante(reclamo) {
  if (!reclamo) {
    throw new Error("No se recibieron los datos del reclamo.");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const ancho = pdf.internal.pageSize.getWidth();
  const alto = pdf.internal.pageSize.getHeight();
  const margen = 18;
  const color = MUNICIPIO.color;

  const codigo = obtener(reclamo, "codigoReclamo", "codigo_reclamo");

  if (!codigo) {
    throw new Error(
      "El reclamo no tiene código. Verificá la respuesta del backend.",
    );
  }

  const fechaOriginal = obtener(
    reclamo,
    "fechaRegistro",
    "fecha_registro",
    "fechaAlta",
    "fecha_alta",
  );

  let fecha = "No disponible";

  if (fechaOriginal) {
    const fechaTexto = String(fechaOriginal).slice(0, 10);
    const partes = fechaTexto.split("-");

    fecha =
      partes.length === 3
        ? `${partes[2]}/${partes[1]}/${partes[0]}`
        : fechaTexto;
  }

  const estado =
    obtener(reclamo, "estado", "nombreEstado", "nombre_estado") || "Nuevo";

  const area = reclamo.areaResponsable || "No especificada";

  const calle = obtener(reclamo, "calle");
  const alturaCalle = obtener(reclamo, "altura");
  const calleUno = obtener(reclamo, "calleUno", "calle_uno");
  const calleDos = obtener(reclamo, "calleDos", "calle_dos");
  const localidad = obtener(reclamo, "localidad");
  const codigoPostal = obtener(reclamo, "codigoPostal", "codigo_postal");
  const partida = obtener(reclamo, "numeroPartida", "numero_partida");
  const descripcion =
    obtener(reclamo, "detalle", "detalleReclamo", "detalle_reclamo") ||
    "Sin descripción";

  const direccion = [
    [calle, alturaCalle].filter(Boolean).join(" "),
    calleUno || calleDos ? `Entre ${calleUno || "—"} y ${calleDos || "—"}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const localidadCompleta = [
    localidad,
    codigoPostal ? `CP ${codigoPostal}` : "",
  ]
    .filter(Boolean)
    .join(" - ");

  // Marco de la página.
  pdf.setDrawColor(...color);
  pdf.setLineWidth(0.6);
  pdf.roundedRect(10, 10, ancho - 20, alto - 20, 3, 3);

  // Encabezado institucional.
  let logoCargado = false;

  try {
    const logo = await cargarImagen(MUNICIPIO.logo);
    pdf.addImage(logo, "PNG", margen, 16, 23, 23);
    logoCargado = true;
  } catch {
    // El comprobante puede generarse aunque todavía no haya logo.
  }

  const inicioTexto = logoCargado ? 47 : margen;

  pdf.setTextColor(...color);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.text(MUNICIPIO.nombre, inicioTexto, 23);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(MUNICIPIO.sistema, inicioTexto, 30);

  pdf.setDrawColor(...color);
  pdf.line(margen, 44, ancho - margen, 44);

  // Título.
  pdf.setTextColor(35, 45, 55);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.text("COMPROBANTE DE RECLAMO", ancho / 2, 54, {
    align: "center",
  });

  // Código destacado.
  pdf.setFillColor(240, 247, 242);
  pdf.roundedRect(margen, 61, ancho - margen * 2, 19, 2, 2, "F");

  pdf.setTextColor(...color);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("CÓDIGO DE RECLAMO", ancho / 2, 68, {
    align: "center",
  });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.text(String(codigo), ancho / 2, 75, {
    align: "center",
  });

  // Fecha y estado.
  pdf.setTextColor(45, 55, 65);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Fecha de registro: ${fecha}`, margen, 91);
  pdf.text(`Estado inicial: ${estado}`, margen, 99);

  // Separador y título de datos.
  pdf.setDrawColor(220, 226, 230);
  pdf.line(margen, 106, ancho - margen, 106);

  pdf.setTextColor(...color);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("DATOS DEL RECLAMO", margen, 116);

  // Función para escribir campos con valores multilínea.
  let y = 127;

  const agregarCampo = (
    etiqueta,
    valor,
    anchoDisponible = ancho - margen * 2,
  ) => {
    pdf.setTextColor(75, 85, 95);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text(`${etiqueta}:`, margen, y);

    pdf.setTextColor(35, 45, 55);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    const texto = pdf.splitTextToSize(
      String(valor || "No especificado"),
      anchoDisponible - 2,
    );

    pdf.text(texto, margen, y + 6);
    y += 6 + texto.length * 5 + 4;
  };

  agregarCampo("Área responsable", area);
  agregarCampo("Dirección", direccion || "No especificada");
  agregarCampo("Localidad", localidadCompleta || "No especificada");
  agregarCampo("Número de partida", partida || "No especificado");

  pdf.setTextColor(75, 85, 95);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.text("DESCRIPCIÓN:", margen, y);

  y += 7;

  pdf.setTextColor(35, 45, 55);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const lineasDescripcion = pdf.splitTextToSize(
    String(descripcion),
    ancho - margen * 2,
  );

  // Evita que la descripción se superponga con el pie.
  const limiteDescripcion = alto - 65;
  const lineasDisponibles = Math.max(
    1,
    Math.floor((limiteDescripcion - y) / 5),
  );

  pdf.text(lineasDescripcion.slice(0, lineasDisponibles), margen, y);

  if (lineasDescripcion.length > lineasDisponibles) {
    pdf.text("…", margen, limiteDescripcion);
  }

  // Pie institucional.
  const pieY = alto - 48;

  pdf.setDrawColor(220, 226, 230);
  pdf.line(margen, pieY, ancho - margen, pieY);

  pdf.setTextColor(...color);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("CONSERVE ESTE COMPROBANTE", ancho / 2, pieY + 9, {
    align: "center",
  });

  pdf.setTextColor(75, 85, 95);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);

  pdf.text(
    "Utilice el código de reclamo para realizar consultas",
    ancho / 2,
    pieY + 15,
    { align: "center" },
  );

  pdf.text("o efectuar el seguimiento del trámite.", ancho / 2, pieY + 20, {
    align: "center",
  });

  pdf.text(`Sitio web: ${MUNICIPIO.sitioWeb}`, margen, pieY + 30);
  pdf.text(`Teléfono: ${MUNICIPIO.telefono}`, margen, pieY + 36);

  // Descarga directa en la computadora.
  pdf.save(`Comprobante-${codigo}.pdf`);
}
