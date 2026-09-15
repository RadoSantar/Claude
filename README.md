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

## Weiterer Wiederherstellungspunkt: v1.9.38 (nach Einall-Rechercheaudit Runde 2)

`nuzlocke-v2-checkpoint-v1.9.38.html` ist ein weiterer eingefrorener Schnappschuss, direkt nach dem
zweiten, diesmal vollständig in `audit_reports/gen5.md` dokumentierten Rechercheaudit zu Schwarz/Weiß
und Schwarz2/Weiß2 (Cheren6-Standort korrigiert, Bucht von Ondula ergänzt, drei fälschlich als
Rivalenkampf geführte Matisse-Verbündetenkämpfe entfernt, zwei echte Matisse-Postgame-Rückkämpfe sowie
drei Schattentrio-Kämpfe vor Ghetsis ergänzt, Zinzolins dritter Kampf korrekt verortet + Strandgrotte
ergänzt). Diese Datei wird nicht mehr verändert - Grund für diesen zusätzlichen Punkt (zusätzlich zur
"aktuellen Standardversion" oben): eine frühere Sitzung ist abgestürzt und mehrere darin recherchierte,
aber nie committete Erkenntnisse gingen verloren - dieser Checkpoint sichert den Stand direkt nach der
Wiederholung dieser Recherche.

So kommt man zu diesem Stand zurück:
1. Claude bitten: "stelle den v1.9.38-Checkpoint wieder her" — dann wird `nuzlocke-v2-checkpoint-v1.9.38.html` erneut als Artifact veröffentlicht, oder
2. Den Commit direkt auschecken:
   ```
   git checkout efabfe7 -- nuzlocke-v2-editionen.html
   ```

## Weiterer Wiederherstellungspunkt: v1.9.39 (nach Kalos-Rechercheaudit Runde 2)

`nuzlocke-v2-checkpoint-v1.9.39.html` ist ein weiterer eingefrorener Schnappschuss, direkt nach dem
in `audit_reports/gen6.md` dokumentierten Rechercheaudit zu Kalos (X/Y): komplettes Team-Flare-
Wissenschaftler-Quintett (Aliana/Bryony/Celosia/Mable/Xerosic, 9 Kämpfe) als Vorstand-Bosskarten
ergänzt, Flordelis' (Lysandres) dritter Kampf ergänzt und Level korrigiert, ein fehlender fünfter
Rivalenkampf ergänzt und alle Rivalen-Level korrigiert, Connies Ass korrigiert, Standorte
„Omega-Höhle" und „Route 22" ergänzt. Diese Datei wird nicht mehr verändert.

So kommt man zu diesem Stand zurück:
1. Claude bitten: "stelle den v1.9.39-Checkpoint wieder her" — dann wird `nuzlocke-v2-checkpoint-v1.9.39.html` erneut als Artifact veröffentlicht, oder
2. Den Commit direkt auschecken:
   ```
   git checkout b99e113 -- nuzlocke-v2-editionen.html
   ```

## Weiterer Wiederherstellungspunkt: v1.9.42 (Sprite-Konsistenz-Audit, Teil 1: Gen 5)

`nuzlocke-v2-checkpoint-v1.9.42.html` ist ein weiterer eingefrorener Schnappschuss, direkt nach dem
in `audit_reports/gen5-sprites.md` dokumentierten ersten Teil eines generationsübergreifenden
Sprite-Konsistenz-Audits: 15 der 16 statischen Arenaleiter-/Top-Vier-/Champion-Sprites in Schwarz/Weiß
auf die bereits animierte Schwarz2/Weiß2-Version derselben Bulbagarden-Archives-Quelle umgestellt.
Ghetsis bewusst als einziger weiterhin statisch belassen (sein B2W2-Sprite zeigt ein story-vorgreifendes
anderes Outfit). Diese Datei wird nicht mehr verändert.

So kommt man zu diesem Stand zurück:
1. Claude bitten: "stelle den v1.9.42-Checkpoint wieder her" — dann wird `nuzlocke-v2-checkpoint-v1.9.42.html` erneut als Artifact veröffentlicht, oder
2. Den Commit direkt auschecken:
   ```
   git checkout f87b3e4 -- nuzlocke-v2-editionen.html
   ```

## Weiterer Wiederherstellungspunkt: v1.9.47 (vor der Sprite-Auslagerung)

`nuzlocke-v2-checkpoint-v1.9.47.html` ist der letzte Schnappschuss VOR einem größeren internen Umbau:
die App war auf 15,88 MB angewachsen (94,8% davon reine Sprite-Bilddaten als Base64 in vier riesigen
JS-Zeilen eingebettet), was auf Mobilgeräten - v.&nbsp;a. in der installierten PWA - zu Abstürzen schon
beim Laden führte. Ab v1.9.48 liegen alle 2027 Sprite-Bilder als echte Dateien unter `sprites/` statt
eingebettet (siehe `tools/extract-sprites.js`); `nuzlocke-v2-editionen.html` selbst schrumpfte dadurch
auf 865 KB. Diese Checkpoint-Datei ist bewusst noch die alte, vollständig in sich geschlossene Version
(kein `sprites/`-Ordner nötig) - falls der Umbau je zurückgerollt werden müsste.

So kommt man zu diesem Stand zurück:
1. Claude bitten: "stelle den v1.9.47-Checkpoint wieder her" — dann wird `nuzlocke-v2-checkpoint-v1.9.47.html` erneut als Artifact veröffentlicht (funktioniert eigenständig, ohne `sprites/`-Ordner), oder
2. Den Commit direkt auschecken:
   ```
   git checkout 9e3680d -- nuzlocke-v2-checkpoint-v1.9.47.html
   cp nuzlocke-v2-checkpoint-v1.9.47.html nuzlocke-v2-editionen.html
   ```

### Als Offline-App installieren (Netlify)

Der Ordner `pwa/` enthält alles, was zusätzlich zur `index.html` (Kopie von `nuzlocke-v2-editionen.html`)
für eine echte installierbare, offline-fähige PWA gebraucht wird:
- `manifest.json` – App-Name, Icons, Farben, `display:"standalone"`
- `sw.js` – Service Worker, der die App beim ersten Laden cached (danach funktioniert sie komplett ohne
  Internetverbindung; Cache-Name enthält eine Versionsnummer, die bei größeren Updates hochgezählt werden
  sollte, damit Nutzer:innen die neue Version bekommen statt der alten aus dem Cache)
- `icon-192.png`, `icon-512.png`, `icon-maskable-*.png` – App-Icons (Pokéball, wiederverwendet aus V1.0)

Dazu der Ordner `sprites/` (seit v1.9.48, siehe `tools/extract-sprites.js`): alle Sprite-Bilder liegen
dort als echte Dateien statt als Base64 in `nuzlocke-v2-editionen.html` eingebettet — hält die
Hauptdatei klein (865 KB statt vormals 15,88 MB) und lässt den Browser Sprites über seine normale,
speicherschonende Bild-Pipeline nachladen/cachen, statt eine riesige JS-Konstante am Stück parsen zu
müssen (Root Cause für Abstürze beim Laden auf Mobilgeräten, siehe Checkpoint v1.9.47 oben).

**Wichtig:** alle sieben `pwa/`+`index.html`-Dateien müssen im ZIP/Ordner auf derselben Ebene liegen,
nicht mit `pwa/` als Unterordner — `index.html` verweist mit reinen Dateinamen ohne Pfad auf
`manifest.json`/`sw.js`, und `manifest.json` genauso auf seine Icons. Landet `pwa/` als eigener
Unterordner im Archiv (z.B. durch ein simples `zip -r deploy.zip index.html pwa`), findet der Browser
Manifest/Service Worker/Icons nicht mehr — die Seite lädt zwar noch, aber "Zum Home-Bildschirm
hinzufügen" verhält sich dann nur wie ein Lesezeichen statt wie eine echte installierbare Offline-App
(genau dieser Fehler ist schon einmal passiert). `sprites/` selbst darf dagegen als Unterordner bleiben
— `index.html` verweist darauf immer mit dem vollen relativen Pfad (`sprites/modern/25.webp`), der
unabhängig von einer Unterordner-Ebene auflöst.

Deshalb: `node tools/build-netlify-zip.js` ausführen — baut automatisch ein korrekt flaches
`nuzlocke-netlify-deploy.zip` im Repo-Root (Kopie von `nuzlocke-v2-editionen.html` als `index.html`,
alle vier `pwa/`-Dateien ohne Unterordner, sowie der komplette `sprites/`-Ordner). Dieses ZIP komplett
per Drag & Drop auf [app.netlify.com/drop](https://app.netlify.com/drop) ziehen — **nicht nur die
`index.html` allein**.

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
