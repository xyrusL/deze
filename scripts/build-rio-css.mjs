import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "lightningcss";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssDir = path.join(rootDir, "public", "assets", "css");
const rawCssPath = path.join(cssDir, "riostyle.raw.css");
const minifiedCssPath = path.join(cssDir, "riostyle.css");

async function buildRioCss() {
  await mkdir(cssDir, { recursive: true });

  const rawCss = await readFile(rawCssPath);
  const { code } = transform({
    filename: rawCssPath,
    code: rawCss,
    minify: true,
  });

  await writeFile(minifiedCssPath, code);
  console.log(`Updated ${path.relative(rootDir, minifiedCssPath)} from ${path.relative(rootDir, rawCssPath)}`);
}

buildRioCss().catch((error) => {
  console.error("Failed to build Rio CSS.");
  console.error(error);
  process.exitCode = 1;
});
