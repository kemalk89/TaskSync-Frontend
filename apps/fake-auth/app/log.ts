import fs from "fs";
import path from "path";

const LOG_PATH = path.join(process.cwd(), "logs.log");

export function log(message: string) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_PATH, `[${timestamp}] ${message}\n`);
}
