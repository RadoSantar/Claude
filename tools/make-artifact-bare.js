#!/usr/bin/env node
/*
 * Strippt die Standalone-Dokumentstruktur (<!doctype>, <html>, <head>, <body>-Tags) aus
 * nuzlocke-v2-editionen.html, damit die verbleibende "nackte" HTML für den Artifact()-Publish
 * genutzt werden kann.
 *
 * Grund: das Artifact-Tool wrappt veröffentlichten Inhalt selbst in ein
 * <!doctype html>…<head>…</head><body>-Gerüst - eigene doctype/html/head/body-Tags im
 * veröffentlichten Inhalt führen zu einer verschachtelten/doppelten Kopf-Struktur, wodurch die
 * zur Laufzeit injizierten Editions-Farbschema-Regeln (injectEditionThemeCSS()) in der falschen
 * Cascade-Reihenfolge landen können - genau das hat den Bug verursacht, bei dem im Claude-Artifact-
 * Preview plötzlich alle Editionen im Hell-Modus HG/SS' Standardfarben zeigten, obwohl der lokale
 * Standalone-Test (ohne Artifact-Wrapper) einwandfrei lief.
 *
 * nuzlocke-v2-editionen.html selbst bleibt unverändert (die volle Dokumentstruktur wird für
 * Netlify/Offline-Installation gebraucht) - nur die Kopie für den Artifact-Publish wird gestrippt.
 *
 * Nutzung:
 *   node tools/make-artifact-bare.js [Ziel-Pfad]
 *   (Standard-Ziel: ein temporärer Pfad wird ausgegeben)
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const SOURCE = path.join(__dirname, "..", "nuzlocke-v2-editionen.html");
const target = process.argv[2] || path.join(os.tmpdir(), "nuzlocke-artifact-bare.html");

const content = fs.readFileSync(SOURCE, "utf8");

const startMarker = "<title>Nuzlocke</title>";
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
  console.error(`Startmarker "${startMarker}" nicht gefunden - Struktur von ${SOURCE} hat sich geändert, Skript anpassen.`);
  process.exit(1);
}

const endMarker = "</body></html>";
const endIdx = content.lastIndexOf(endMarker);
if (endIdx === -1) {
  console.error(`Endmarker "${endMarker}" nicht gefunden - Struktur von ${SOURCE} hat sich geändert, Skript anpassen.`);
  process.exit(1);
}

let bare = content.slice(startIdx, endIdx);

// Zwischen dem style-Block und der App-Markup sitzt noch der </head>\n<body>-Übergang der
// Wrapper-Struktur (title+style liegen im <head>, die eigentliche App-Markup im <body>) - auch
// diesen entfernen, nicht nur die äußeren doctype/html/head-open/body-close/html-close-Tags.
bare = bare.replace(/\n<\/head>\n<body>\n/, "\n");

if (/<!doctype|<html[ >]|<head[ >]|<\/head>|<body[ >]/i.test(bare)) {
  console.error("Gestrippter Inhalt enthält noch doctype/html/head/body-Tags - Marker prüfen.");
  process.exit(1);
}

fs.writeFileSync(target, bare, "utf8");
console.log(`Geschrieben: ${target} (${bare.length} Zeichen, ${Math.round(bare.length / 1024)} KB)`);
console.log("Diese Datei per Artifact(action:\"publish\", file_path:...) veröffentlichen, NICHT nuzlocke-v2-editionen.html direkt.");
