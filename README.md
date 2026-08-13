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
   git checkout 84df535 -- nuzlocke-v2-standard.html
   ```

### Als Offline-App installieren (Netlify)

`nuzlocke-v2-editionen.html` lässt sich 1:1 als statische Seite hosten - z. B. per Drag & Drop einer
ZIP-Datei (enthält nur eine `index.html`) auf [app.netlify.com/drop](https://app.netlify.com/drop). Auf dem
iPhone danach über Safari die Netlify-URL öffnen und über "Teilen" → "Zum Home-Bildschirm" hinzufügen -
die Seite bringt dafür bereits die nötigen `apple-mobile-web-app-*`-Meta-Tags mit und startet dann ohne
Safari-Oberfläche als eigenständige App.

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
