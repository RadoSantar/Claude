#!/usr/bin/env node
/*
 * Baut das Netlify-Deploy-ZIP korrekt FLACH zusammen: index.html (Kopie von
 * nuzlocke-v2-editionen.html) und alle vier pwa/-Dateien liegen im ZIP-Root nebeneinander, nicht
 * in einem verschachtelten "pwa"-Unterordner.
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
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const SOURCE_HTML = path.join(ROOT, "nuzlocke-v2-editionen.html");
const PWA_DIR = path.join(ROOT, "pwa");
const target = process.argv[2] || path.join(ROOT, "nuzlocke-netlify-deploy.zip");

if (!fs.existsSync(SOURCE_HTML)) {
  console.error(`Quelle nicht gefunden: ${SOURCE_HTML}`);
  process.exit(1);
}
if (!fs.existsSync(PWA_DIR)) {
  console.error(`pwa/-Ordner nicht gefunden: ${PWA_DIR}`);
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
  fs.copyFileSync(path.join(PWA_DIR, name), path.join(stagingDir, name));
});

const expected = ["index.html", "manifest.json", "sw.js", "icon-192.png", "icon-512.png", "icon-maskable-192.png", "icon-maskable-512.png"];
const staged = fs.readdirSync(stagingDir).sort();
const missing = expected.filter(f => !staged.includes(f));
if (missing.length) {
  console.error(`Fehlende Dateien im gestagten Ordner: ${missing.join(", ")}`);
  process.exit(1);
}

if (fs.existsSync(target)) fs.unlinkSync(target);

// -j (junk paths) waere hier unnoetig, da bereits alles flach in stagingDir liegt - cwd auf
// stagingDir setzen und "." zippen, damit im ZIP selbst keine Ordnerebene (weder "pwa/" noch der
// zufaellige stagingDir-Name) landet, sondern die sieben Dateien direkt im Root des Archivs.
execFileSync("zip", ["-r", target, "."], { cwd: stagingDir, stdio: "inherit" });

fs.rmSync(stagingDir, { recursive: true, force: true });

console.log(`\nGeschrieben: ${target}`);
console.log(`Enthält flach (kein Unterordner): ${staged.join(", ")}`);
console.log(`Dieses ZIP komplett (nicht nur index.html) auf app.netlify.com/drop ziehen.`);
