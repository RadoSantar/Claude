#!/usr/bin/env node
/*
 * Zieht die vier riesigen, als Base64 inline eingebetteten Sprite-Konstanten (SPRITES,
 * SPRITES_MODERN, BOSS_SPRITES, BADGE_SPRITES) aus nuzlocke-v2-editionen.html heraus in echte
 * Bilddateien unter sprites/ und ersetzt die Konstanten durch schlanke Arrays/Objekte aus
 * relativen Pfad-Strings ("sprites/modern/25.webp" statt "data:image/webp;base64,...").
 *
 * Grund: die Datei bestand zuletzt zu ~95% (15 von 15,88 MB) aus genau diesen vier Base64-Blobs -
 * das machte das Parsen der einzigen riesigen <script>-Zeile auf leistungsschwächeren Geräten
 * (v.a. Mobilgeräte/installierte PWA) instabil, bis hin zu Abstürzen schon beim bloßen Laden, vor
 * jeder Interaktion. Als echte Bilddateien lädt der Browser sie stattdessen über seine normale,
 * speicherschonende Bild-Pipeline (nativ verzögert/gecacht durch den ohnehin vorhandenen
 * Service-Worker-Fetch-Handler in pwa/sw.js), statt sie als eine gigantische JS-String-Konstante
 * am Stück parsen und im Speicher halten zu müssen.
 *
 * WICHTIG: dieser Schritt macht nuzlocke-v2-editionen.html NICHT mehr eigenständig/self-contained
 * (Bilder liegen jetzt als separate Dateien daneben, nicht mehr eingebettet) - das ist für die
 * PWA/Netlify-Auslieferung genau das Ziel, bricht aber den bisherigen "eine einzige Datei"-Anspruch
 * für den Claude-Artifact-Publish (der aus genau diesem Grund weiterhin eine vollständig
 * eingebettete Kopie braucht, siehe tools/make-artifact-bundle.js).
 *
 * Idempotent: bereits auf Pfad-Strings umgestellte Konstanten werden übersprungen (kein erneutes
 * Extrahieren nötig, falls das Skript versehentlich zweimal läuft oder nach einem künftigen Audit
 * erneut Sprites per Data-URI ergänzt und dann eingesammelt werden sollen).
 *
 * Nutzung:
 *   node tools/extract-sprites.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "nuzlocke-v2-editionen.html");
const SPRITES_DIR = path.join(ROOT, "sprites");

const EXT_BY_MIME = { "image/png": "png", "image/webp": "webp", "image/jpeg": "jpg", "image/gif": "gif" };

function extFor(dataUrl) {
  const m = /^data:([^;]+);base64,/.exec(dataUrl);
  if (!m) throw new Error(`Kein Data-URI-Format erkannt: ${dataUrl.slice(0, 40)}...`);
  const ext = EXT_BY_MIME[m[1]];
  if (!ext) throw new Error(`Unbekannter MIME-Typ ${m[1]}`);
  return { ext, b64: dataUrl.slice(m[0].length) };
}

function writeSpriteFile(subdir, filenameStem, dataUrl) {
  const { ext, b64 } = extFor(dataUrl);
  const dir = path.join(SPRITES_DIR, subdir);
  fs.mkdirSync(dir, { recursive: true });
  const relPath = `sprites/${subdir}/${filenameStem}.${ext}`;
  fs.writeFileSync(path.join(ROOT, relPath), Buffer.from(b64, "base64"));
  return relPath;
}

function isAlreadyExtracted(value) {
  return typeof value === "string" && value.startsWith("sprites/");
}

// Extrahiert ein dex-indiziertes Array (SPRITES, SPRITES_MODERN): Index 0 ist immer null/ungenutzt
// (Dex-Nummern sind 1-basiert), jeder weitere Eintrag entweder ein Data-URI oder schon ein Pfad.
function extractArray(lines, constName, subdir) {
  const prefix = `const ${constName} = [`;
  const idx = lines.findIndex(l => l.startsWith(prefix));
  if (idx === -1) throw new Error(`Zeile "${prefix}..." nicht gefunden - Struktur geändert?`);
  const line = lines[idx];
  const openBracket = line.indexOf("[");
  const suffixStart = line.lastIndexOf("]") + 1; // alles nach der schliessenden Klammer 1:1 uebernehmen (i.d.R. ";")
  const jsonPart = line.slice(openBracket, suffixStart);
  const suffix = line.slice(suffixStart);
  const arr = JSON.parse(jsonPart);

  let written = 0, skipped = 0;
  const outArr = arr.map((val, dex) => {
    if (val == null) return null;
    if (isAlreadyExtracted(val)) { skipped++; return val; }
    written++;
    return writeSpriteFile(subdir, String(dex), val);
  });

  lines[idx] = `const ${constName} = ${JSON.stringify(outArr)}${suffix}`;
  console.log(`${constName}: ${written} Sprites extrahiert, ${skipped} bereits Pfade.`);
}

// Extrahiert ein schluessel-indiziertes Objekt (BOSS_SPRITES, BADGE_SPRITES).
function extractObject(lines, constName, subdir) {
  const prefix = `const ${constName}={`;
  const idx = lines.findIndex(l => l.startsWith(prefix));
  if (idx === -1) throw new Error(`Zeile "${prefix}..." nicht gefunden - Struktur geändert?`);
  const line = lines[idx];
  const openBrace = line.indexOf("{");
  const suffixStart = line.lastIndexOf("}") + 1;
  const jsonPart = line.slice(openBrace, suffixStart);
  const suffix = line.slice(suffixStart);
  const obj = JSON.parse(jsonPart);

  let written = 0, skipped = 0;
  const outObj = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val == null) { outObj[key] = val; continue; }
    if (isAlreadyExtracted(val)) { outObj[key] = val; skipped++; continue; }
    outObj[key] = writeSpriteFile(subdir, key, val);
    written++;
  }

  lines[idx] = `const ${constName}=${JSON.stringify(outObj)}${suffix}`;
  console.log(`${constName}: ${written} Sprites extrahiert, ${skipped} bereits Pfade.`);
}

const before = fs.statSync(SOURCE).size;
const content = fs.readFileSync(SOURCE, "utf8");
const hadTrailingNewline = content.endsWith("\n");
const lines = content.split("\n");
if (hadTrailingNewline) lines.pop(); // split() erzeugt sonst ein leeres Element am Ende

extractArray(lines, "SPRITES", "legacy");
extractArray(lines, "SPRITES_MODERN", "modern");
extractObject(lines, "BOSS_SPRITES", "boss");
extractObject(lines, "BADGE_SPRITES", "badges");

fs.writeFileSync(SOURCE, lines.join("\n") + (hadTrailingNewline ? "\n" : ""), "utf8");
const after = fs.statSync(SOURCE).size;

console.log("");
console.log(`nuzlocke-v2-editionen.html: ${before} -> ${after} Bytes (${Math.round((1 - after / before) * 100)}% kleiner)`);
