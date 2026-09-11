# Nuzlocke Tracker — Projektgedächtnis

Diese Datei existiert, damit eine neue/abgestürzte Claude-Sitzung den Kontext nicht erst mühsam
neu rekonstruieren muss. Anlass: eine frühere claude.ai-Konversation stürzte mit "Sitzung konnte
nicht gestartet werden" endgültig ab; mehrere darin recherchierte, aber nie committete Erkenntnisse
(Audit-Berichte zu Kalos/Alola/Galar) gingen dabei unwiederbringlich verloren. Regel seither:
**alles Wichtige landet als committete Datei im Repo, nicht nur im Chat-Kontext.**

## Was das Projekt ist

Ein Nuzlocke-Run-Tracker für Pokémon-Randomizer-Runs, als einzelne selbstständige HTML-Datei
(Vanilla JS, kein Build-Schritt, kein Framework) gebaut, veröffentlicht als Claude-Artifact und
zusätzlich als installierbare Offline-PWA über Netlify. Ziel-Meilenstein **"Version 2.0"** ist
erreicht, sobald **alle Editionen vollständig vorhanden sind** — aktuell fehlt dafür noch das
Schwert/Schild-DLC sowie einzelne, im Änderungsprotokoll dokumentierte Datenlücken (siehe unten).

## Dateien im Repo

- **`nuzlocke-v2-editionen.html`** — die aktiv weiterentwickelte, "lebende" Version. Alle Änderungen
  passieren hier.
- **`nuzlocke-v1-baseline.html`**, **`nuzlocke-v2-standard.html`**, **`nuzlocke-v2-checkpoint-v1.9.38.html`**
  — eingefrorene Wiederherstellungspunkte, werden nie mehr verändert. Siehe `README.md` für die
  jeweiligen Commits und Restore-Anleitungen. Bei größeren, riskanten Änderungsrunden (z.B. ein
  ganzer Recherche-Audit-Durchlauf) einen neuen solchen Checkpoint anlegen, statt nur auf Git-History
  zu vertrauen — der Nutzer will jederzeit einen benannten, verlässlichen Rückkehrpunkt haben.
- **`pwa/`** — `manifest.json`, `sw.js`, Icons für den Offline-Installations-Build (siehe README).
- **`tools/validate-editions.js`** — **einziges** vorhandenes Validierungsskript. Prüft pro Edition:
  doppelte Boss-/Standort-IDs, verwaiste Bosse, `bossAfter`-Verweise auf unbekannte Standorte/Bosse,
  unbekannte `ace`-Spezies. **Vor jedem Publish/Commit mit Datenänderungen ausführen:**
  `node tools/validate-editions.js`. Hinweis: ein Nutzer erinnerte sich an "mehrere Regressionssuiten",
  die in einer früheren (abgestürzten) Sitzung liefen — im Repo committet ist aber nur dieses eine
  Skript. Falls weitere Prüfungen gewünscht sind, sollten sie als eigene committete Skripte in
  `tools/` angelegt werden, nicht nur ad-hoc in einer Sitzung laufen, sonst gehen sie beim nächsten
  Absturz genauso verloren.
- **`tools/make-artifact-bare.js`** — strippt doctype/html/head/body vor dem `Artifact()`-Publish
  (sonst verschachtelte Kopf-Struktur, Editions-Farbschema bricht). **Immer** die gestrippte Kopie
  publizieren, nie `nuzlocke-v2-editionen.html` direkt.
- **`audit_reports/gen{N}.md`** — Rechercheaudit-Berichte pro Generation (z.B. `gen5.md` = Einall).
  **Sofort nach dem Schreiben committen und pushen**, nicht erst am Ende einer Sitzung sammeln —
  genau das Versäumnis, das `gen6.md`–`gen8.md` (Kalos/Alola/Galar) verloren gehen ließ. Diese drei
  Berichte existieren nicht mehr; die entsprechenden Funde sind nur noch als Stichpunkte im
  Changelog dokumentiert (siehe unten) und müssten bei Bedarf neu recherchiert werden.

## Datenmodell (in `nuzlocke-v2-editionen.html`)

- `GAMES` — Registry aller Editionen. Jeder Eintrag: `regions` (Standorte), `bosses`, `bossAfter`
  (Standort → Boss-IDs, steuert wann ein Bosskampf auf der Karte erscheint), `starters`, `theme`,
  `generation`.
- Ein Boss-Eintrag trackt **nur das Ass** (`ace: "Speziesname"` oder `null` wenn starterabhängig),
  nicht das komplette gegnerische Team — für ein komplettes Team gibt es das separate, optionale
  Freitextfeld pro Boss (Hausregel-Schalter "Gegner-Team tracken").
- **Wichtige Unterscheidung, die schon zweimal übersehen wurde:** nicht jede Begegnung mit einem
  Rivalen ist ein Kampf GEGEN ihn — manche Spiele haben "Multi Battle"/Verbündeten-Doppelkämpfe, bei
  denen der Rivale MIT dir gegen einen dritten Gegner kämpft (z.B. Hugh/Matisse in B2W2 gegen Team
  Plasma). Solche Begegnungen gehören NICHT als `cls:"Rivale"`-Bosskarte rein, sonst suggeriert die
  App fälschlich, man müsse/könne den Rivalen dort besiegen.
- Bei Versions-Trios (z.B. Rot/Blau/Gelb, Schwarz/Weiß) erzeugt `buildVersionGames()` mehrere
  `GAMES`-Einträge aus einem gemeinsamen Basis-Datensatz mit punktuellen Overrides.
- Postgame-Standorte, die auf der Karte weit VOR ihrem eigentlichen Story-Zeitpunkt erscheinen
  würden, wenn man sie an eine früh in der Liste stehende Kachel hängt (z.B. eine Postgame-Rematch
  an einer Stadt aus der Spielmitte): als **eigene, ans Ende angehängte Standort-Kachel** führen
  (Präzedenzfall: ORAS' "Route 103 (Postgame)"), nicht am alten Standort-Eintrag mit-bündeln. Eine
  Bündelung auf denselben frühen/späten Standort ist nur akzeptabel, wenn dieser Standort selbst
  schon ganz am Anfang oder ganz am Ende der Liste steht (Präzedenzfall: Bells Postgame-Rückkampf an
  Avenitia, dem allerersten Standort).
- Neue Edition ergänzen: ausführliche Schritt-für-Schritt-Anleitung als Kommentar direkt über
  `KALOS_LOCATIONS` in der Datei (`/* ---------- Editionen ---------- */`).

## Deutsche Namen — bekannte Stolperfallen

Bei der Recherche-Arbeit mehrfach mit falschen Annahmen hereingefallen — beim nächsten Audit nicht
blind aus dem Gedächtnis übernehmen, sondern gegenprüfen:
- Ähnlich klingende deutsche Namen können komplett andere Pokémon sein (z.B. "Klikk" = Klink, nicht
  Joltik/Voltini; "Zwirrfinst" = eine ganz andere Familie als Banette, das im Deutschen "Banette"
  heißt; "Flunkifer" = Mawile, nicht Accelgor/Hydragil).
- KI-generierte Zusammenfassungen von Serebii/Bulbapedia-Seiten (über Suche statt direktem Fetch)
  können Kampf-Reihenfolgen/Level durcheinanderbringen — im Zweifel die Bulbapedia-Trainer-Tabelle
  direkt fetchen (dort steht die Team-Reihenfolge explizit), nicht nur eine Text-Paraphrase glauben.

## Changelog-Pflege

Es gibt **zwei Stellen**, die immer synchron gehalten werden müssen:
1. `CHANGELOG_HTML`-Konstante in `nuzlocke-v2-editionen.html` (wird als Sheet in der App selbst
   angezeigt).
2. Die separat veröffentlichte Artifact-Seite **"Nuzlocke Änderungsprotokoll"**
   (`https://claude.ai/code/artifact/6ee2fb0a-8e1f-4052-aab1-f197cb326aeb`) — laut Kommentar in der
   App "1:1" identisch zu Punkt 1.

Bei jeder Version: neuen `<div class="entry">`-Block ganz oben in `<div class="log">` einfügen,
Versionsnummer (`APP_VERSION`-Konstante) hochzählen, Stat-Kachel "Versionsstände" hochzählen, Footer-
Versionsnummer aktualisieren. Offene Punkte/Backlog-Einträge unter `id="offene-punkte"` aktuell
halten (z.B. den Einall-Eintrag in "Offene Datenkorrekturen aus dem Gen-1-9-Rechercheaudit" nach
Behebung anpassen statt stehen zu lassen).

## Bekannter offener Rechercheaudit-Backlog (Stand v1.9.38)

- **Kalos (X/Y), Alola (Sonne/Mond/USUM), Galar (Schwert/Schild)**: Funde nur noch als Kurzfassung
  im Changelog dokumentiert, die Detailberichte (`gen6.md`–`gen8.md`) sind verloren — müsste komplett
  neu recherchiert werden, diesmal mit sofortigem Commit.
- **Einall (Schwarz2/Weiß2) — komplettes Postgame**: Rückkehr nach West-Einall (~15 Standorte,
  Avenitia/Route 1-3/Gavina/Orion City/Septerna City/Wunderbrücke/P2-Labor/Route 17-18/Schwarzes
  Hochhaus-Weiße Baumhöhle) fehlt komplett, bewusst als eigener großer Schritt zurückgestellt.
- Siehe `audit_reports/gen5.md` für den vollständigen, bereits abgehakten Einall-Bericht (Runde 2,
  Wiederholung) als Vorlage für den Berichtsstil.

## Workflow-Hinweise für diese Codebase

- Branch: `claude/magical-cray-d6vvlx` (siehe Git-Remote-Konfiguration der Session).
- Vor Datenänderungen an Bossen/Standorten: `node tools/validate-editions.js` — bei Fehlern NICHT
  committen.
- Vor jedem Artifact-Publish: `node tools/make-artifact-bare.js` laufen lassen und die gestrippte
  Ausgabedatei publizieren.
- Größere Rechercherunden (Audits) immer: (1) Recherche → (2) `audit_reports/gen{N}.md` schreiben
  und SOFORT committen/pushen → (3) Nutzer die Funde zum Gegenchecken vorlegen, bevor irgendwas an
  `nuzlocke-v2-editionen.html` geändert wird → (4) nach Freigabe umsetzen → (5) validieren → (6)
  Changelog an beiden Stellen aktualisieren, Version hochzählen → (7) neuen Backup-Checkpoint
  anlegen, falls es sich um eine größere Änderungsrunde handelt → (8) committen/pushen.
