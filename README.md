# Nuzlocke Tracker

Dieses Repo dient als Backup/Restore-Punkt für den Nuzlocke-Tracker (Claude Artifact).

## Ursprungsversion wiederherstellen

`nuzlocke-v1-baseline.html` ist der exakte Stand der App, ab dem die Weiterentwicklung (V2.0) begonnen hat
(inkl. "Testumgebung"-Badge im Header). Diese Datei bleibt unverändert, damit jederzeit dorthin
zurückgekehrt werden kann — unabhängig von der Versionshistorie des Artifacts.

So kommt man zurück:
1. Claude bitten: "stelle die Ursprungsversion wieder her" — dann wird `nuzlocke-v1-baseline.html` erneut als Artifact veröffentlicht, oder
2. Den Commit direkt auschecken:
   ```
   git checkout 9416d80 -- nuzlocke-v1-baseline.html
   ```
