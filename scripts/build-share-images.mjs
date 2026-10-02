// Regenerates the social-share art from the hand-drawn marks in public/.
//
//   node scripts/build-share-images.mjs
//
// public/logo.svg and public/favicon.svg are the originals - drawn on paper and
// traced into SVG. This script only rasterises them and lays type over a
// background; it never redraws them.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p));

const BG = "#fbf9f5";

// 1. Rasterise the drawn logo so it can be embedded in the share-image source.
const logo = await sharp(read("public/logo.svg"), { density: 300 })
  .resize(760, 507)
  .png()
  .toBuffer();

const template = read("scripts/share-image.svg").toString();
const withLogo = template.replace(
  /(<image[^>]*xlink:href=")data:image\/png;base64,[^"]*(")/,
  `$1data:image/png;base64,${logo.toString("base64")}$2`,
);
writeFileSync(join(root, "scripts/share-image.svg"), withLogo);

// 2. Share image: 1200x630, the size every social platform accepts.
await sharp(Buffer.from(withLogo), { density: 96 })
  .resize(1200, 630)
  .png()
  .toFile(join(root, "public/og.png"));

// 3. iOS home-screen icon and the square logo for structured data.
await sharp(read("public/favicon.svg"), { density: 300 })
  .resize(180, 180)
  .flatten({ background: BG })
  .png()
  .toFile(join(root, "public/apple-touch-icon.png"));

await sharp(read("public/favicon.svg"), { density: 300 })
  .resize(512, 512)
  .flatten({ background: BG })
  .png()
  .toFile(join(root, "public/logo-512.png"));

console.log("public/og.png, public/apple-touch-icon.png, public/logo-512.png rebuilt");
