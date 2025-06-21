import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Manual __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("✅ Loaded env:", process.env.DATABASE_URL?.slice(0, 50) || "Not set");
