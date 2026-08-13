# Nuzlocke Tracker

Dieses Repo dient als Backup/Restore-Punkt für den Nuzlocke-Tracker (Claude Artifact).

## Aktuelle Standardversion

`nuzlocke-v2-editionen.html` ist die aktiv weiterentwickelte, aktuelle Standardversion (Mehr-Editionen-
Support für HG/SS, Smaragd, Diamant/Perl, Platin; Starterwahl; Städte/Spezialorte mit Fangmethoden;
einklappbare Standort-Historie; Team-Tausch; kein "Testumgebung"-Badge mehr). Sie wird für den echten
Gebrauch (Netlify-Deploy, "Zum Home-Bildschirm hinzufügen") genutzt und ist der Ausgangspunkt für alle
weitere Entwicklung.

`nuzlocke-v2-standard.html` ist ein eingefrorener Schnappschuss genau dieses Stands (Commit siehe unten),
damit auch nach vielen weiteren Änderungen jederzeit hierher zurückgekehrt werden kann - unabhängig von
der Versionshistorie des Artifacts. Diese Datei wird nicht mehr verändert.

So kommt man zu diesem Stand zurück:
1. Claude bitten: "stelle die aktuelle Standardversion wieder her" — dann wird `nuzlocke-v2-standard.html` erneut als Artifact veröffentlicht, oder
2. Den Commit direkt auschecken:
   ```
   git checkout 8a0da5d -- nuzlocke-v2-standard.html
   ```

### Als Offline-App installieren (Netlify)

Der Ordner `pwa/` enthält alles, was zusätzlich zur `index.html` (Kopie von `nuzlocke-v2-editionen.html`)
für eine echte installierbare, offline-fähige PWA gebraucht wird:
- `manifest.json` – App-Name, Icons, Farben, `display:"standalone"`
- `sw.js` – Service Worker, der die App beim ersten Laden cached (danach funktioniert sie komplett ohne
  Internetverbindung; Cache-Name enthält eine Versionsnummer, die bei größeren Updates hochgezählt werden
  sollte, damit Nutzer:innen die neue Version bekommen statt der alten aus dem Cache)
- `icon-192.png`, `icon-512.png`, `icon-maskable-*.png` – App-Icons (Pokéball, wiederverwendet aus V1.0)

Zum Deployen alle sieben Dateien (die `index.html` aus dem Repo-Root umbenannt/kopiert plus die vier Dateien
aus `pwa/`) gemeinsam als ZIP oder Ordner per Drag & Drop auf [app.netlify.com/drop](https://app.netlify.com/drop)
ziehen — **nicht nur die `index.html` allein**, sonst fehlen Service Worker und Icons und die Installation
verhält sich nur wie ein Lesezeichen statt wie eine echte Offline-App.

Auf dem iPhone danach über Safari die Netlify-URL öffnen und über "Teilen" → "Zum Home-Bildschirm" hinzufügen.

## Ursprungsversion (V1) wiederherstellen

`nuzlocke-v1-baseline.html` ist der exakte Stand der App, ab dem die Weiterentwicklung (V2.0) begonnen hat
(inkl. "Testumgebung"-Badge im Header). Diese Datei bleibt unverändert, damit jederzeit dorthin
zurückgekehrt werden kann — unabhängig von der Versionshistorie des Artifacts.

So kommt man zurück:
1. Claude bitten: "stelle die Ursprungsversion wieder her" — dann wird `nuzlocke-v1-baseline.html` erneut als Artifact veröffentlicht, oder
2. Den Commit direkt auschecken:
   ```
   git checkout 9416d80 -- nuzlocke-v1-baseline.html
   ```
