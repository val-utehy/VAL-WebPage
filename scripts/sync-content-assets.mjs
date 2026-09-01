import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const collections = ["gallery", "members", "highlights"];

for (const collection of collections) {
  const source = path.join(root, "content", collection);
  const target = path.join(root, "public", collection);
  if (!existsSync(source)) continue;
  mkdirSync(target, { recursive: true });

  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const images = path.join(source, entry.name, "images");
    if (!existsSync(images)) continue;
    const destination = path.join(target, entry.name, "images");
    rmSync(destination, { recursive: true, force: true });
    cpSync(images, destination, { recursive: true });
  }
}
