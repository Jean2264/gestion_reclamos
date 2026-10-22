
import bcrypt from "bcrypt";

const hashAdmin = await bcrypt.hash("prueba", 10);
const hashEmpleado = await bcrypt.hash("prueba", 10);

console.log("Admin:", hashAdmin);
console.log("Empleado:", hashEmpleado);
