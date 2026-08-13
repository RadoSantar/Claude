#!/usr/bin/env node
/*
 * Validiert die GAMES-Registrierung im Nuzlocke-Tracker-Artifact (nuzlocke-v2-editionen.html).
 *
 * Prüft für JEDE Edition in GAMES:
 *   - keine doppelten Boss-IDs
 *   - keine doppelten Standort-IDs (aus regions abgeleitet, wie freshState() es tut)
 *   - jeder bossAfter-Schlüssel verweist auf einen echten Standort ("Region|Name")
 *   - jeder Boss wird von genau einem bossAfter-Eintrag referenziert (kein verwaister Boss)
 *   - jede bossAfter-Referenz zeigt auf einen existierenden Boss
 *   - jedes ace-Feld ist ein echter Name aus der SPECIES-Liste
 *
 * Nutzung:
 *   node tools/validate-editions.js [Pfad-zur-HTML-Datei]
 *   (Standard: nuzlocke-v2-editionen.html im Repo-Root)
 *
 * Funktionsweise: extrahiert den <script>-Inhalt, ersetzt die riesigen Sprite-Konstanten (SPRITES,
 * BOSS_SPRITES) durch leere Platzhalter (Base64-Daten sind für diese Prüfung irrelevant und würden
 * nur unnötig Speicher/Zeit kosten), schneidet am VALIDATE-EDITIONS-BOUNDARY-Marker ab (GAMES ist
 * dort fertig zusammengebaut, aber noch kein DOM-Zugriff nötig) und führt den Rest in einer
 * Node-vm aus.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const target = process.argv[2] || path.join(__dirname, "..", "nuzlocke-v2-editionen.html");
const html = fs.readFileSync(target, "utf8");

// Die Datei kann mehrere <script>-Blöcke enthalten (z.B. einen "frame-runtime"-Vorspann des
// Artifact-Viewers) - wir wollen gezielt den App-Script-Block. Nur Tags matchen, die allein auf
// ihrer Zeile stehen (^<script>$ / ^</script>$), damit ein zufälliges "<script>"-Textfragment in
// einem Kommentar (z.B. Prosa über HTML-Tags) die Erkennung nicht verfälscht; zur Sicherheit
// zusätzlich am APP_VERSION-Marker verifiziert.
const scriptBlocks = [...html.matchAll(/^<script>\n([\s\S]*?)\n<\/script>$/gm)];
const appScript = scriptBlocks.find(m => m[1].includes("APP_VERSION"));
if (!appScript) {
  console.error("Kein App-<script>-Block (mit APP_VERSION) gefunden in", target);
  process.exit(1);
}
let src = appScript[1];

src = src.replace(/^const SPRITES=.*$/m, "const SPRITES=[];");
src = src.replace(/^const BOSS_SPRITES=.*$/m, "const BOSS_SPRITES={};");

const boundary = src.indexOf("injectEditionThemeCSS();");
if (boundary === -1) {
  console.error("VALIDATE-EDITIONS-BOUNDARY-Marker (injectEditionThemeCSS();) nicht gefunden - Skript und Artifact sind nicht mehr synchron.");
  process.exit(1);
}
src = src.slice(0, boundary);
// Top-level const/let landen in einer vm-Kontext-Ausführung nicht automatisch als Property auf
// dem Sandbox-Objekt (nur var/Funktionsdeklarationen tun das) - daher hier explizit rausreichen.
src += "\n;globalThis.__validationExport = { GAMES, SPECIES };";

const sandbox = {};
vm.createContext(sandbox);
try {
  vm.runInContext(src, sandbox, { filename: target });
} catch (e) {
  console.error("Fehler beim Ausführen des extrahierten Scripts:", e.message);
  process.exit(1);
}

const { GAMES, SPECIES } = sandbox.__validationExport || {};
if (!GAMES) {
  console.error("GAMES wurde nicht gefunden - Extraktion/Boundary-Marker prüfen.");
  process.exit(1);
}

let errors = 0;
const speciesSet = new Set(SPECIES || []);

console.log("Editionen:", Object.keys(GAMES).join(", "));
console.log("");

Object.values(GAMES).forEach(g => {
  const bossIds = g.bosses.map(b => b.id);
  const dupeBossIds = bossIds.filter((v, i) => bossIds.indexOf(v) !== i);
  if (dupeBossIds.length) {
    console.log(`[${g.id}] DOPPELTE BOSS-IDs:`, [...new Set(dupeBossIds)]);
    errors++;
  }

  const locs = [];
  g.regions.forEach(([region, names]) => {
    names.forEach(entry => {
      const name = typeof entry === "string" ? entry : entry.name;
      const id = (region + "-" + name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      locs.push({ id, name, region });
    });
  });
  const locIds = locs.map(l => l.id);
  const dupeLocIds = locIds.filter((v, i) => locIds.indexOf(v) !== i);
  if (dupeLocIds.length) {
    console.log(`[${g.id}] DOPPELTE STANDORT-IDs:`, [...new Set(dupeLocIds)]);
    errors++;
  }

  const allLocKeys = new Set(locs.map(l => l.region + "|" + l.name));
  Object.keys(g.bossAfter).forEach(key => {
    if (!allLocKeys.has(key)) {
      console.log(`[${g.id}] bossAfter-Schlüssel verweist auf unbekannten Standort:`, key);
      errors++;
    }
  });

  const referenced = new Set();
  Object.values(g.bossAfter).forEach(arr => arr.forEach(id => referenced.add(id)));
  bossIds.forEach(id => {
    if (!referenced.has(id)) {
      console.log(`[${g.id}] VERWAISTER BOSS (in keinem bossAfter-Eintrag):`, id);
      errors++;
    }
  });
  referenced.forEach(id => {
    if (!bossIds.includes(id)) {
      console.log(`[${g.id}] bossAfter verweist auf nicht existierenden Boss:`, id);
      errors++;
    }
  });

  if (speciesSet.size) {
    g.bosses.forEach(b => {
      if (b.ace && !speciesSet.has(b.ace)) {
        console.log(`[${g.id}] UNBEKANNTE SPEZIES "${b.ace}" bei Boss "${b.id}"`);
        errors++;
      }
    });
  }

  const noCatchCount = locs.length ? g.regions.flatMap(([, names]) => names).filter(e => typeof e === "object" && e.noCatch).length : 0;
  const noteCount = locs.length ? g.regions.flatMap(([, names]) => names).filter(e => typeof e === "object" && e.note).length : 0;
  console.log(`[${g.id}] ${locs.length} Standorte (${noCatchCount} ohne Wildfang, ${noteCount} mit Fangmethoden-Hinweis), ${bossIds.length} Bosse`);
});

console.log("");
console.log(errors === 0 ? "VALIDATION OK - keine Fehler." : `VALIDATION FEHLGESCHLAGEN - ${errors} Fehler.`);
process.exit(errors === 0 ? 0 : 1);
