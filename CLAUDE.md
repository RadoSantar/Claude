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
- **`nuzlocke-v1-baseline.html`**, **`nuzlocke-v2-standard.html`** — eingefrorene Wiederherstellungs-
  punkte, werden nie mehr verändert, liegen noch als Dateien im Repo (klein, je ~1-1,4 MB).
- **Checkpoints v1.9.38/v1.9.39/v1.9.42/v1.9.47** — dieselbe Rolle (benannte Wiederherstellungspunkte
  nach größeren Änderungsrunden), aber **seit v1.9.49 NICHT mehr als Dateien im Arbeitsverzeichnis**,
  auf Nutzerwunsch entfernt: vier Schnappschüsse à 15-16 MB summierten sich auf ~61 MB totes Gewicht,
  obwohl nur im Notfall Zugriff nötig ist. Der Inhalt bleibt vollständig über Git-History abrufbar —
  `git show <hash>:<dateiname> > <ziel>` (Hashes + genaue Befehle in `README.md`, je ein Abschnitt pro
  Checkpoint). **Wichtig, nicht vergessen:** `git rm` einer Datei schrumpft NICHT das `.git`-Verzeichnis
  selbst (168 MB, Stand v1.9.49) — alte Blobs bleiben in jedem historischen Commit erhalten, das würde
  nur eine destruktive History-Rewrite (z.B. `git filter-repo`, danach Force-Push) beheben, die alle
  Commit-Hashes ab dem betroffenen Punkt ändert und explizit vom Nutzer angefragt werden müsste, bevor
  sie je ausgeführt wird — bisher NICHT gewünscht/angefragt.
  Bei künftigen größeren, riskanten Änderungsrunden weiterhin einen benannten Checkpoint per Commit
  anlegen (Commit-Message + Dateiname wie bisher), aber überlegen, ob die Datei danach gleich wieder
  aus dem Arbeitsverzeichnis entfernt wird (analog zu den vieren oben), statt sie dauerhaft liegen zu
  lassen — Präzedenzfall siehe hier.
- **`pwa/`** — `manifest.json`, `sw.js`, Icons für den Offline-Installations-Build (siehe README).
- **`sprites/`** (seit v1.9.48) — 2027 Sprite-Bilddateien (`legacy/{dex}.png`, `modern/{dex}.webp`,
  `boss/{key}.{png|webp}`, `badges/{key}.webp`), ausgelagert aus vier vormals riesigen Base64-JS-
  Konstanten in `nuzlocke-v2-editionen.html` (`SPRITES`, `SPRITES_MODERN`, `BOSS_SPRITES`,
  `BADGE_SPRITES` enthalten seither nur noch kurze relative Pfad-Strings als Werte, gleiche
  Array-/Objekt-Form wie vorher — kein Code, der diese Konstanten konsumiert, musste sich ändern).
  Grund: die Datei war auf 15,88 MB angewachsen (94,8% davon reine Sprite-Bilddaten als Base64 in
  vier mehrere Megabyte langen JS-Zeilen), was auf Mobilgeräten (v.&nbsp;a. installierte PWA) zu
  Abstürzen schon beim Laden führte, bevor irgendetwas bearbeitet werden konnte. Nach der Auslagerung
  nur noch ~865 KB. **Zwei Auslieferungswege, zwei Strategien**, weil die Artifact-Publish-Grenze bei
  255 Dateien liegt (weit unter 2027 Sprites): PWA/Netlify bekommt die 2027 Sprites als echte Dateien
  neben `index.html`; der Artifact-Publish-Build bettet sie über `tools/inline-sprites.js` wieder als
  Base64 in EINE Datei ein (bleibt dort weiterhin nötig, siehe Eintrag unten).
- **`tools/validate-editions.js`** — **einziges** vorhandenes Validierungsskript. Prüft pro Edition:
  doppelte Boss-/Standort-IDs, verwaiste Bosse, `bossAfter`-Verweise auf unbekannte Standorte/Bosse,
  unbekannte `ace`-Spezies. **Vor jedem Publish/Commit mit Datenänderungen ausführen:**
  `node tools/validate-editions.js`. Hinweis: ein Nutzer erinnerte sich an "mehrere Regressionssuiten",
  die in einer früheren (abgestürzten) Sitzung liefen — im Repo committet ist aber nur dieses eine
  Skript. Falls weitere Prüfungen gewünscht sind, sollten sie als eigene committete Skripte in
  `tools/` angelegt werden, nicht nur ad-hoc in einer Sitzung laufen, sonst gehen sie beim nächsten
  Absturz genauso verloren.
- **`tools/extract-sprites.js`** (seit v1.9.48) — extrahiert die Base64-Werte der vier Sprite-
  Konstanten in echte Dateien unter `sprites/{legacy,modern,boss,badges}/` und ersetzt die Werte in
  `nuzlocke-v2-editionen.html` durch kurze Pfad-Strings. Idempotent (überspringt Werte, die schon mit
  `"sprites/"` beginnen) — kann also gefahrlos erneut laufen, falls ein künftiger Sprite-Audit neue
  Bilder wieder als Base64 einfügt.
- **`tools/inline-sprites.js`** (seit v1.9.48) — Gegenstück zu `extract-sprites.js`, NUR für den
  Artifact-Publish-Build gebraucht: bettet die referenzierten `sprites/...`-Dateien wieder als
  Base64-Data-URIs ein, damit die dort veröffentlichte Kopie weiterhin eine einzige, in sich
  geschlossene Datei ist (Artifact-Publish erlaubt max. 255 Dateien pro Veröffentlichung, weit unter
  den 2027 Sprites). Wird von `tools/make-artifact-bare.js` automatisch vorgeschaltet aufgerufen.
- **`tools/make-artifact-bare.js`** — ruft zuerst `inline-sprites.js` auf (s.o.), dann strippt
  doctype/html/head/body vor dem `Artifact()`-Publish (sonst verschachtelte Kopf-Struktur, Editions-
  Farbschema bricht). **Immer** die gestrippte Kopie publizieren, nie `nuzlocke-v2-editionen.html`
  direkt.
- **`tools/build-netlify-zip.js`** — baut das Netlify-Deploy-ZIP korrekt FLACH (index.html +
  alle vier `pwa/`-Dateien ohne Unterordner) plus den kompletten `sprites/`-Ordner (der darf als
  Unterordner bleiben, da `index.html` ihn immer über den vollen relativen Pfad referenziert). Nie
  manuell `zip -r deploy.zip index.html pwa sprites` o.ä. bauen — das verschachtelt `pwa/` als
  Unterordner im Archiv, wodurch `index.html`s pfadlose Verweise auf `manifest.json`/`sw.js` (und
  dessen Verweise auf die Icons) ins Leere laufen und die Installierbarkeit auf Netlify kaputtgeht
  (ist bereits einmal passiert). Immer `node tools/build-netlify-zip.js` benutzen.
  **Wichtig, mehrfach übersehen:** Netlify hat KEIN Auto-Deploy aus diesem Repo verbunden — das ZIP
  muss nach JEDER Änderung, die auf dem Handy ankommen soll, neu gebaut und manuell auf
  [app.netlify.com/drop](https://app.netlify.com/drop) gezogen werden. Ein alter, im Repo liegender
  `nuzlocke-netlify-deploy.zip`-Snapshot kann daher beliebig veraltet sein (ist selbst nicht Teil der
  Versionshistorie/kein committetes Artefakt) — vor jeder Aussage "die Netlify-App ist aktuell" das
  ZIP-Datum bzw. den Build-Zeitpunkt prüfen, nicht annehmen.
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
- **Einklapp-Mechanik (seit v1.9.46–1.9.48):** zwei getrennte Sammel-Gruppen pro Region, farblich
  unterschieden — grau/`collapseToggleHtml()`/`expandedRegions` für automatisch eingeklappte, bereits
  ERLEDIGTE Standorte; gold/`stashCollapseToggleHtml()`/`expandedStashRegions` für manuell
  eingeklappte, noch OFFENE Standorte (`state.manualCollapsedLocs`, z.B. "braucht eine noch nicht
  vorhandene VM"). Bewusst jeweils GENAU EIN Sammel-Button pro Region und Kategorie, nicht ein Button
  pro Standort. Das Auf-/Zuklappen selbst läuft über direkte DOM-Klassenumschaltung (nicht per
  Voll-Render), damit die `.collapsible-body`-Grid-Animation (`grid-template-rows`, absichtlich
  langsam/weich, s. CSS) sichtbar bleibt statt durch einen Re-Render übersprungen zu werden.

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

Nur noch **eine** Stelle pflegen: die `CHANGELOG_HTML`-Konstante in `nuzlocke-v2-editionen.html`
(wird als Sheet in der App selbst angezeigt; taucht dadurch automatisch auch im Live-App-Artifact
auf, sobald dieses republished wird).

Bei jeder Version: neuen `<div class="entry">`-Block ganz oben in `<div class="log">` einfügen,
Versionsnummer (`APP_VERSION`-Konstante) hochzählen, Stat-Kachel "Versionsstände" hochzählen, Footer-
Versionsnummer aktualisieren. Offene Punkte/Backlog-Einträge unter `id="offene-punkte"` aktuell
halten (z.B. den Einall-Eintrag in "Offene Datenkorrekturen aus dem Gen-1-9-Rechercheaudit" nach
Behebung anpassen statt stehen zu lassen).

**Das separate Artifact "Nuzlocke Änderungsprotokoll"
(`https://claude.ai/code/artifact/6ee2fb0a-8e1f-4052-aab1-f197cb326aeb`) wird seit v1.9.48 bewusst
NICHT mehr aktualisiert/publiziert** — es duplizierte nur den ohnehin in der App sichtbaren
Changelog und kostete pro Version einen kompletten Lese-vor-Publish-Durchlauf (>1500 Zeilen) plus
einen zusätzlichen Edit- und Publish-Schritt, ohne eigenen Mehrwert. Es bleibt online als
eingefrorener Schnappschuss bis v1.9.47, aber NICHT weiter anfassen, außer der Nutzer bittet
explizit wieder darum.

## Bekannter offener Rechercheaudit-Backlog (Stand v1.9.39)

- **Alola (Sonne/Mond/USUM), Galar (Schwert/Schild)**: Funde nur noch als Kurzfassung im Changelog
  dokumentiert, die Detailberichte (`gen7.md`/`gen8.md`) sind verloren — müsste komplett neu
  recherchiert werden, diesmal mit sofortigem Commit (siehe `gen5.md`/`gen6.md` als Vorlage für den
  Berichtsstil).
- **Einall (Schwarz2/Weiß2) — komplettes Postgame**: Rückkehr nach West-Einall (~15 Standorte,
  Avenitia/Route 1-3/Gavina/Orion City/Septerna City/Wunderbrücke/P2-Labor/Route 17-18/Schwarzes
  Hochhaus-Weiße Baumhöhle) fehlt komplett, bewusst als eigener großer Schritt zurückgestellt.
- **Kalos (X/Y)**: erledigt in v1.9.39, siehe `audit_reports/gen6.md`. Dabei bestätigt: Vorstands-/
  Admin-Mitglieder eines Bösewicht-Teams (z.B. Team Flares Wissenschaftler) gehören konsequent als
  eigene `cls:"Vorstand"`-Bosskarten rein, nicht nur der Teamboss selbst - exakt dasselbe Muster wie
  bereits bei Team Rocket/Galaktik/Magma/Aqua/Plasma etabliert. Bei künftigen Audits (Alola: Faba/
  Plumeria: Galar: analog) diesem Präzedenzfall folgen, nicht extra nachfragen.

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
