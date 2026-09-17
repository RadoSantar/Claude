#!/usr/bin/env node
/*
 * Baut das Netlify-Deploy-ZIP korrekt FLACH zusammen: index.html (Kopie von
 * nuzlocke-v2-editionen.html) und alle vier pwa/-Dateien liegen im ZIP-Root nebeneinander, nicht
 * in einem verschachtelten "pwa"-Unterordner. Der sprites/-Ordner (seit der Sprite-Auslagerung aus
 * nuzlocke-v2-editionen.html, siehe tools/extract-sprites.js) wird als Unterordner mit übernommen -
 * anders als bei den pwa/-Dateien ist das hier unproblematisch, da index.html konsequent relative
 * Pfade wie "sprites/modern/25.webp" nutzt, die unabhängig von einer Unterordner-Ebene auflösen.
 *
 * Grund für dieses Skript: index.html verweist mit reinen Dateinamen ohne Ordnerpfad auf sein
 * Manifest/seinen Service Worker (<link rel="manifest" href="manifest.json">,
 * navigator.serviceWorker.register('sw.js')) und manifest.json selbst genauso auf seine Icons
 * (z.B. "icon-192.png") - alle sieben Dateien MÜSSEN deshalb im selben Verzeichnis liegen. Landet
 * pwa/ als eigener Unterordner im ZIP (z.B. durch ein simples `zip -r deploy.zip index.html pwa`),
 * bricht die Installierbarkeit auf Netlify: Manifest/Service Worker/Icons sind für den Browser
 * nicht mehr auffindbar, "Zum Home-Bildschirm hinzufügen" verhält sich dann nur wie ein Lesezeichen.
 *
 * Nutzung:
 *   node tools/build-netlify-zip.js [Ziel-ZIP-Pfad]
 *   (Standard-Ziel: nuzlocke-netlify-deploy.zip im Repo-Root)
 *
 * Service-Worker-Cache-Name: pwa/sw.js' CACHE_NAME wird HIER, beim Staging, automatisch auf die
 * aktuelle APP_VERSION überschrieben (nicht mehr von Hand pflegen) - blieb dieser Wert zwischen
 * zwei Deploys unverändert, installiert der Browser zwar ein neues sw.js, aber dessen cache-first
 * fetch-Handler liefert weiterhin die ALTE gecachte index.html aus demselben, unveränderten
 * Cache-Namen aus (der activate-Handler löscht nur ANDERE Cache-Namen) - genau das ließ eine
 * installierte PWA zwischen v1.9.49 und v1.9.65 unbemerkt auf demselben veralteten Stand stehen,
 * bis ein Nutzer einen fehlenden, längst ergänzten Kartenpunkt meldete. Siehe ausführlicher
 * Kommentar in pwa/sw.js selbst.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const SOURCE_HTML = path.join(ROOT, "nuzlocke-v2-editionen.html");
const PWA_DIR = path.join(ROOT, "pwa");
const SPRITES_DIR = path.join(ROOT, "sprites");
const target = process.argv[2] || path.join(ROOT, "nuzlocke-netlify-deploy.zip");

const htmlSource = fs.readFileSync(SOURCE_HTML, "utf8");
const versionMatch = htmlSource.match(/const APP_VERSION = "([^"]+)"/);
if (!versionMatch) {
  console.error("APP_VERSION nicht in nuzlocke-v2-editionen.html gefunden.");
  process.exit(1);
}
const appVersion = versionMatch[1];

if (!fs.existsSync(SOURCE_HTML)) {
  console.error(`Quelle nicht gefunden: ${SOURCE_HTML}`);
  process.exit(1);
}
if (!fs.existsSync(PWA_DIR)) {
  console.error(`pwa/-Ordner nicht gefunden: ${PWA_DIR}`);
  process.exit(1);
}
if (!fs.existsSync(SPRITES_DIR)) {
  console.error(`sprites/-Ordner nicht gefunden: ${SPRITES_DIR} - wurde tools/extract-sprites.js schon einmal ausgeführt?`);
  process.exit(1);
}

const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), "nuzlocke-netlify-"));

fs.copyFileSync(SOURCE_HTML, path.join(stagingDir, "index.html"));

const pwaFiles = fs.readdirSync(PWA_DIR);
if (pwaFiles.length === 0) {
  console.error(`pwa/ ist leer - erwartet werden manifest.json, sw.js und vier Icon-Dateien.`);
  process.exit(1);
}
pwaFiles.forEach(name => {
  if (name === "sw.js") {
    const swSource = fs.readFileSync(path.join(PWA_DIR, name), "utf8");
    const swStamped = swSource.replace(/const CACHE_NAME = "[^"]+";/, `const CACHE_NAME = "nuzlocke-tracker-v${appVersion}";`);
    fs.writeFileSync(path.join(stagingDir, name), swStamped);
  } else {
    fs.copyFileSync(path.join(PWA_DIR, name), path.join(stagingDir, name));
  }
});

fs.cpSync(SPRITES_DIR, path.join(stagingDir, "sprites"), { recursive: true });
const spriteFileCount = fs.readdirSync(SPRITES_DIR).reduce(
  (sum, sub) => sum + fs.readdirSync(path.join(SPRITES_DIR, sub)).length, 0
);

const expected = ["index.html", "manifest.json", "sw.js", "icon-192.png", "icon-512.png", "icon-maskable-192.png", "icon-maskable-512.png", "sprites"];
const staged = fs.readdirSync(stagingDir).sort();
const missing = expected.filter(f => !staged.includes(f));
if (missing.length) {
  console.error(`Fehlende Dateien im gestagten Ordner: ${missing.join(", ")}`);
  process.exit(1);
}

if (fs.existsSync(target)) fs.unlinkSync(target);

// -j (junk paths) waere hier unnoetig, da bereits alles flach in stagingDir liegt - cwd auf
// stagingDir setzen und "." zippen, damit im ZIP selbst keine Ordnerebene (weder "pwa/" noch der
// zufaellige stagingDir-Name) landet, sondern die sieben Dateien+sprites/ direkt im Root des
// Archivs (sprites/ selbst bleibt als Unterordner erhalten, siehe Kommentar oben).
execFileSync("zip", ["-r", target, "."], { cwd: stagingDir, stdio: "inherit" });

fs.rmSync(stagingDir, { recursive: true, force: true });

console.log(`\nGeschrieben: ${target}`);
console.log(`Service-Worker-Cache-Name gesetzt auf: nuzlocke-tracker-v${appVersion}`);
console.log(`Enthält flach (kein Unterordner): ${staged.filter(f => f !== "sprites").join(", ")}, sowie sprites/ (${spriteFileCount} Dateien).`);
console.log(`Dieses ZIP komplett (nicht nur index.html) auf app.netlify.com/drop ziehen.`);
