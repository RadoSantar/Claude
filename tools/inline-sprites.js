#!/usr/bin/env node
/*
 * Kehrt tools/extract-sprites.js um: liest eine Kopie von nuzlocke-v2-editionen.html, bei der die
 * vier Sprite-Konstanten (SPRITES, SPRITES_MODERN, BOSS_SPRITES, BADGE_SPRITES) auf relative
 * Pfad-Strings ("sprites/modern/25.webp") verweisen, und bettet jede referenzierte Datei wieder als
 * "data:image/...;base64,..." direkt in die Konstante ein - produziert also wieder eine einzige,
 * vollstaendig eigenstaendige HTML-Datei ohne externe Abhaengigkeiten.
 *
 * Wird ausschliesslich fuer den Claude-Artifact-Publish gebraucht: Artifacts erlauben pro
 * Veroeffentlichung nur 255 zusaetzliche Dateien, die App hat aber ueber 2000 einzelne
 * Sprite-Dateien - eine direkte Mehrdatei-Veroeffentlichung ist damit nicht moeglich. Fuer die
 * PWA/Netlify-Auslieferung (kein Dateilimit) bleiben die Sprites dagegen als echte Dateien liegen,
 * siehe tools/build-netlify-zip.js.
 *
 * nuzlocke-v2-editionen.html selbst wird NICHT veraendert - das Ergebnis landet in einer separaten
 * Zieldatei, die tools/make-artifact-bare.js im Anschluss weiterverarbeitet (Kopf-Struktur strippen).
 *
 * Nutzung:
 *   node tools/inline-sprites.js [Ziel-Pfad]
 *   (Standard-Ziel: ein temporaerer Pfad wird ausgegeben)
 *
 * Auch als Modul nutzbar: const { inlineSprites } = require("./inline-sprites");
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "nuzlocke-v2-editionen.html");

const MIME_BY_EXT = { png: "image/png", webp: "image/webp", jpg: "image/jpeg", gif: "image/gif" };

function inlineValue(val) {
  if (typeof val !== "string" || !val.startsWith("sprites/")) return val;
  const ext = path.extname(val).slice(1);
  const mime = MIME_BY_EXT[ext];
  if (!mime) throw new Error(`Unbekannte Sprite-Dateiendung: ${val}`);
  const bytes = fs.readFileSync(path.join(ROOT, val));
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

function inlineArray(lines, constName) {
  const prefix = `const ${constName} = [`;
  const idx = lines.findIndex(l => l.startsWith(prefix));
  if (idx === -1) throw new Error(`Zeile "${prefix}..." nicht gefunden - Struktur geändert?`);
  const line = lines[idx];
  const openBracket = line.indexOf("[");
  const suffixStart = line.lastIndexOf("]") + 1;
  const arr = JSON.parse(line.slice(openBracket, suffixStart));
  const suffix = line.slice(suffixStart);
  lines[idx] = `const ${constName} = ${JSON.stringify(arr.map(inlineValue))}${suffix}`;
}

function inlineObject(lines, constName) {
  const prefix = `const ${constName}={`;
  const idx = lines.findIndex(l => l.startsWith(prefix));
  if (idx === -1) throw new Error(`Zeile "${prefix}..." nicht gefunden - Struktur geändert?`);
  const line = lines[idx];
  const openBrace = line.indexOf("{");
  const suffixStart = line.lastIndexOf("}") + 1;
  const obj = JSON.parse(line.slice(openBrace, suffixStart));
  const suffix = line.slice(suffixStart);
  const out = {};
  for (const [key, val] of Object.entries(obj)) out[key] = inlineValue(val);
  lines[idx] = `const ${constName}=${JSON.stringify(out)}${suffix}`;
}

function inlineSprites(sourcePath, destPath) {
  const content = fs.readFileSync(sourcePath, "utf8");
  const hadTrailingNewline = content.endsWith("\n");
  const lines = content.split("\n");
  if (hadTrailingNewline) lines.pop();

  inlineArray(lines, "SPRITES");
  inlineArray(lines, "SPRITES_MODERN");
  inlineObject(lines, "BOSS_SPRITES");
  inlineObject(lines, "BADGE_SPRITES");

  const out = lines.join("\n") + (hadTrailingNewline ? "\n" : "");
  fs.writeFileSync(destPath, out, "utf8");
  return out.length;
}

if (require.main === module) {
  const target = process.argv[2] || path.join(os.tmpdir(), "nuzlocke-inlined.html");
  const size = inlineSprites(SOURCE, target);
  console.log(`Geschrieben: ${target} (${size} Zeichen, ${Math.round(size / 1024)} KB)`);
}

module.exports = { inlineSprites };
