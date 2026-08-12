# Nuzlocke Tracker

Dieses Repo dient als Backup/Restore-Punkt für den Nuzlocke-Tracker (Claude Artifact).

## Ursprungsversion wiederherstellen

`nuzlocke-v1-baseline.html` ist der exakte Stand der App, ab dem die Weiterentwicklung (V2.0) begonnen hat
(inkl. "Testumgebung"-Badge im Header). Diese Datei bleibt unverändert, damit jederzeit dorthin
zurückgekehrt werden kann — unabhängig von der Versionshistorie des Artifacts.

So kommt man zurück:
1. Diese Datei öffnen/an Claude geben und erneut als Artifact veröffentlichen ("stelle die Ursprungsversion wieder her"), oder
2. Den Git-Tag `nuzlocke-v1-baseline` auschecken:
   ```
   git checkout nuzlocke-v1-baseline -- nuzlocke-v1-baseline.html
   ```
