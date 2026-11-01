import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta backend/uploads
export const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");
