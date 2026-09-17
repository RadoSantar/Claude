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

**Wichtig für Sitzungs-/Chat-Kontinuität (Stand v1.9.49):** der Nutzer hatte während dieser laufenden
Sitzung mehrfach Abstürze der Claude-App selbst beim Laden dieses (sehr langen) Chats auf dem Handy —
vermutlich weil die Konversation inzwischen sehr viel schweren Tool-Output angesammelt hat (große
Datei-Reads, lange Bash-Ausgaben), nicht wegen eines Fehlers im Nuzlocke-Projekt selbst. Der Nutzer
hat entschieden: **sobald Version 2.0 erreicht ist, wird ein neuer Chat eröffnet**, statt in diesem
weiterzuarbeiten. Falls dieser Chat vorher abstürzt/unbrauchbar wird: der komplette Projektstand ist
jederzeit hier in `CLAUDE.md` + Git-Historie rekonstruierbar, siehe Rest dieser Datei.

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
- **Zweite wichtige Unterscheidung (Fund v1.9.53, Route 22 in Rot/Blau/Gelb/FeuerRot/BlattGrün):**
  wird ein und derselbe Standort im Spielverlauf zweimal besucht (z.B. Rückweg über eine bereits
  bekannte Route), aber NUR damit ein später stattfindender Bosskampf an der richtigen Stelle in der
  Liste erscheint (`bossAfter` braucht einen Listeneintrag an genau dieser Position) — dann braucht
  dieser zweite Standort-Eintrag `noCatch:true`. Sonst suggeriert die App fälschlich einen zweiten,
  unabhängigen Fangversuch am selben Ort, den es in einer Nuzlocke-Regel nicht gibt (nur der erste
  Besuch eines Ortes zählt). Beim nächsten Audit gezielt nach weiteren solchen "Ort erneut betreten,
  nur wegen eines Bosskampfs"-Einträgen ohne `noCatch:true` suchen, nicht nur bei Kanto.
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
  `KALOS_LOCATIONS` in der Datei (`/* ---------- Editionen ---------- */`). Dabei die Reihenfolge der
  Standorte aktiv gegen eine Quelle (z.B. die vollständige Bulbapedia-Ortsliste) verifizieren, nicht
  nur Namen/Vollständigkeit — siehe "Reihenfolge-Verifikation" im Rechercheaudit-Backlog unten, warum
  das bisher zu kurz kam.
- **Einklapp-Mechanik (seit v1.9.46, Bündelung überarbeitet in v1.9.53):** zwei getrennte
  Sammel-Gruppen PRO REGION (nicht pro zusammenhängendem Block!), farblich unterschieden — grau/
  `collapseToggleHtml()`/`expandedRegions` für automatisch eingeklappte, bereits ERLEDIGTE Standorte
  (Segment-Key fest `${regionKey}-done`, seit v1.9.53); gold/`stashCollapseToggleHtml()`/
  `expandedStashRegions` für manuell eingeklappte, noch OFFENE Standorte (`state.manualCollapsedLocs`,
  z.B. "braucht eine noch nicht vorhandene VM", Segment-Key `${regionKey}-stash`). Beide Kategorien
  sammeln ALLE zutreffenden Tiles der Region unabhängig von ihrer Position in EINEN einzigen Block am
  Ende der Region ein (`renderRoutes()`: ein einziger Durchlauf über `tiles`, der in drei Eimer
  einsortiert - offen/inline, erledigt, zurückgestellt - statt wie vor v1.9.53 pro zusammenhängendem
  erledigt-Chunk einen eigenen Toggle mit index-basiertem Segment-Key `${regionKey}-${i}` zu erzeugen,
  was bei mehreren dazwischenliegenden offenen Standorten mehrere kleine Toggles statt eines einzigen
  ergab). Bewusst jeweils GENAU EIN Sammel-Button pro Region und Kategorie, nicht ein Button pro
  Standort/Chunk. Das Auf-/Zuklappen selbst läuft über direkte DOM-Klassenumschaltung (nicht per
  Voll-Render), damit die `.collapsible-body`-Grid-Animation (`grid-template-rows`, absichtlich
  langsam/weich, s. CSS) sichtbar bleibt statt durch einen Re-Render übersprungen zu werden.
  `expandCollapseGroupsForLocation()` (für Standort-Suche/Karten-Sprung) nutzt dieselben fest
  benannten Segment-Keys, keine Chunk-Nachbildung mehr nötig.
- **Später-fangbar-Übersicht (seit v1.9.53):** Lesezeichen-FAB links über dem "Zum aktuellen
  Standort"-Button, nur sichtbar wenn `state.manualCollapsedLocs` nicht leer ist. Öffnet
  `openStashOverviewSheet()` mit allen zurückgestellten Standorten editionsweit (nicht nur der
  aktuellen Region) als Liste, Antippen nutzt denselben `jump-to-location-result`-Mechanismus wie die
  Standort-Suche. Grund: vorher musste man bis zur jeweiligen Region scrollen, um dort den
  Stash-Toggle überhaupt erst zu finden.
  **Flug-Animation beim Zurückstellen (seit v1.9.54):** `flyTileToStash(cardEl)` — beim Klick auf
  `toggle-loc-manual-collapse` (nur Richtung "zurückstellen", nicht beim Wiederherstellen) wird VOR
  `render()` ein `cardEl.cloneNode(true)` an der Original-Position fixiert und per Web-Animations-API
  (FLIP-Technik wie `celebrateOrden`, aber kürzer/ohne Feier-Halt) zum `stashFab`-Button hin
  verkleinert/ausgeblendet, danach kurzer `.pulse`-Bounce am Button. Reihenfolge wichtig: Rect VOR
  dem State-Update/Render erfassen, sonst ist die Kachel an ihrer alten Position schon weg.
- **Standort-Suche (seit v1.9.51):** Lupen-FAB im Routen-Tab öffnet ein Sheet
  (`openLocationSearchSheet()`), Live-Ergebnisliste (`locationSearchResultsHtml()`) respektiert
  bestehende Sichtbarkeits-Filter (`hiddenRegions`, `hidePostgame`). Antippen eines Treffers
  (`data-act="jump-to-location-result"`) klappt via `expandCollapseGroupsForLocation()` bei Bedarf die
  richtige Einklapp-Gruppe auf (repliziert dafür einmalig die Tile-Chunking-Logik aus `renderRoutes()`
  für die eine betroffene Region), rendert neu, scrollt zur Kachel und hebt sie kurz farbig hervor
  (`.search-highlight`, nutzt `--evolve-glow` nur als generischen Aufmerksamkeits-Farbton).
- **Regions-Karte, PROTOTYP nur Rot/Blau (seit v1.9.52, Kartenbild ausgetauscht in v1.9.55):**
  dritter FAB (`mapFab`), nur sichtbar wenn `REGION_MAPS[currentGame().id]` existiert. Zwei Ansichten
  in einem Sheet umschaltbar (`mapViewMode`, `regionMapSheetHtml()`): "Kartengrafik" (Bulbagarden-
  Archiv-Bild, Standorte als absolut positionierte `%`-Punkte via `REGION_MAPS["rot-blau"].points`)
  und "Schema" (reine Listenansicht, Positionen direkt aus der Standort-Reihenfolge abgeleitet, kein
  Platzierungsrisiko — dem Nutzer gefällt diese Ansicht bereits uneingeschränkt gut). Beide nutzen zum
  Sprung denselben `jump-to-location-result`-Mechanismus wie die Standort-Suche (volle
  Wiederverwendung).
  **Bildwechsel v1.9.55:** die ursprüngliche gemalte Rot/Blau-Illustration (`RBY_Kanto.png`, ein
  Puzzle-Artwork) wurde vom Nutzer als "unübersichtlich" zurückgemeldet. Ein vom Nutzer über Google
  gefundenes Referenzbild stammte angeblich von pokeos.com — direkte Prüfung der genannten URL (API-
  Endpunkt `/api/poke/encounters/location?location_id=799&version_group_id=7&lang=6`) ergab, dass
  diese spezielle Seite tatsächlich Begegnungsdaten für "Wandert durch Kanto" (postgame Raikou/Entei-
  Roaming) ist, kein Kartenbild — das gezeigte Bild kam also von woanders auf der Seite. Pokéos wurde
  davon unabhängig als Quelle verworfen (kommerzielle, werbefinanzierte Seite mit Login/"Pro"-Stufe,
  unklare Lizenz) — anders als Bulbapedia/Bulbagarden Archives, die für Fan-/Referenzzwecke gedacht
  sind und bereits für alle anderen Assets dieses Projekts genutzt werden. Nutzer entschied per
  Nachfrage: **Wiki-Archiv-Suche nach ähnlichem Stil**, nicht Pokéos, nicht Edition wechseln. Gefunden:
  `Kanto Town Map PE.png` (Bulbagarden Archives, aus *Pokémon: Let's Go, Pikachu!/Evoli!*, 1280×720,
  saubere kachelbasierte Ingame-Kartenansicht ohne UI-Text) — jetzt unter `sprites/maps/
  kanto-lgpe-map.png`. Verworfene Alternativkandidaten: `FRLG_Kanto.png` (ebenfalls gemaltes
  Puzzle-Artwork, keine Verbesserung), `Stadium 2 Pokédex map Kanto.png` (echtes Ingame-Rendering,
  aber isometrische 3D-Perspektive mit eingebranntem UI-Text wie "PIDGEY's NEST"/"KANTO", dazu nur
  Kartenausschnitt sichtbar — für Punktplatzierung ungeeignet), die klassischen `Kanto Town Map
  RBY/RGBY/GSC.png`-Dateien (alle ≤160×144, zu grobpixelig).
  **Wichtige Einschränkung, nicht vergessen:** auch das neue Bild hat KEINE Text-Beschriftungen. Die
  ursprünglichen v1.9.55-Koordinaten (18 per automatisiertem Pixelfarb-Clustering lokalisierte
  Wegpunkt-Symbole als Anker, Rest nach Kanto-Spielwissen zugeordnet/interpoliert) wirkten laut
  Nutzerfeedback "kreuz und quer" — **in v1.9.57 durch vom Nutzer selbst per Kalibrierungsmodus
  (s.u.) abgetippte Koordinaten ersetzt**, jetzt also tatsächlich am Bild abgelesen statt geraten.
  **Korrektur v1.9.58 — Lektion, nicht wiederholen:** in v1.9.57 wurden die Koordinaten für zweimal
  besuchte Standorte (Vertania City/-Arena; Route 22/Route 22 (Rückweg)) bewusst auf den Mittelwert
  vereinheitlicht, in der Annahme, identische Koordinaten würden korrekt widerspiegeln, dass es sich
  um denselben Ort handelt. **Das war ein Fehler:** `artworkMapHtml()` rendert pro Standortname einen
  eigenen `<button class="map-pin">`, absolut positioniert nach `left/top`-Prozent - liegen zwei Pins
  exakt übereinander, fängt (ohne explizites z-index) der im HTML SPÄTER eingefügte den Klick ab und
  der frühere ist praktisch untappbar. Da "Route 22" (früher Fangversuch möglich!) vor "Route 22
  (Rückweg)" im Standort-Array steht, sprang ein Tap auf den gemeinsamen Punkt immer nur zum
  Rückweg - Nutzerfeedback: "wenn es nun nur zum rückweg springt macht das wenig sinn". Jetzt
  wieder auf die beiden tatsächlich vom Nutzer angetippten (leicht unterschiedlichen) Koordinaten
  zurückgesetzt - beide Pins bleiben dadurch unabhängig tappbar, liegen aber naturgemäß nah
  beieinander (ist ja derselbe reale Ort). **Für künftige Ähnlich-liegende-Standorte-Fälle:** NIE
  exakt identische `points`-Koordinaten für zwei verschiedene Standortnamen vergeben, egal wie
  thematisch passend das wirkt - lieber leicht unterschiedliche, beide individuell tappbare Punkte.
  Bei weiterhin falsch wirkenden Einzelpunkten: erneut über den Kalibrierungsmodus nachjustieren,
  nicht wieder raten.
  Bild liegt (wie schon das vorherige) bewusst nicht in `sprites/` über `extract-sprites.js`
  eingebunden (das Tool kennt nur die vier Sprite-Konstanten) — liegt stattdessen als eigene reale
  Datei unter `sprites/maps/`, die `build-netlify-zip.js` automatisch mitkopiert (kopiert den ganzen
  `sprites/`-Ordner rekursiv) und die beim nächsten Artifact-Publish zusätzlich über den
  `files`-Parameter mitgegeben werden muss (nicht Teil der automatischen `inline-sprites.js`-
  Pipeline). Ausweitung auf weitere Editionen/Regionen bewusst zurückgestellt, bis dieser Prototyp
  gegengecheckt ist.
  **Kalibrierungsmodus (seit v1.9.56):** Nutzerfeedback zu den v1.9.55-Koordinaten war "wirken kreuz
  und quer" — eine gezielte Recherche nach einer beschrifteten Referenz für die Let's-Go-Kartenansicht
  (welcher der 18 sichtbaren Wegpunkte welcher Stadt entspricht) blieb ergebnislos, weder Bulbapedia
  noch gängige Walkthrough-/Guide-Seiten dokumentieren das. Zuverlässiges Erraten ist von hier aus
  also nicht möglich — einzige verbleibende Option: der Nutzer selbst tippt die Punkte, da nur er die
  Karte visuell erkennen kann. Button "Punkte selbst kalibrieren" (nur im Kartengrafik-Modus,
  `calibrationActive`/`calibrationIndex`/`calibrationPoints`, `mapCalibrationHtml()`) führt einmal
  durch alle Standortnamen der aktuellen Edition in `REGION_MAPS[...].points`-Reihenfolge; Antippen
  der Karte (`data-act="calibration-tap"`, Klick-Koordinate relativ zur `getBoundingClientRect()` des
  Kartencontainers in Prozent umgerechnet) setzt die Position für den gerade angezeigten Namen,
  Zurück/Überspringen möglich. Fortschritt wird NICHT im normalen Speicherstand (`state`) abgelegt,
  sondern in einem eigenen `localStorage`-Fach `nuzlocke-map-calibration-<edition-id>` — übersteht
  damit einen versehentlichen Reload, ohne Spielstand-Daten zu berühren. Am Ende erscheint ein
  fertiges, direkt in `REGION_MAPS` einfügbares Objekt-Literal zum Kopieren in einem Textfeld. Reines
  Entwickler-/Einmalwerkzeug für die Kanto-Kalibrierung, kein für den normalen Nuzlocke-Alltag
  gedachtes Feature — nach erfolgreicher Kalibrierung nicht zwingend entfernen (schadet nicht, könnte
  bei künftiger Ausweitung auf weitere Editionen/Kartenbilder wiederverwendet werden), aber auch nicht
  aktiv bewerben.

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
- **Reihenfolge-Verifikation:** Kalos (`gen6.md`) und jetzt auch **Gen 1-3 (Kanto/Johto/Hoenn) sind
  erledigt**, siehe `audit_reports/order-gen1-3.md` (Stand v1.9.50) - 15 Standorte in Kanto (Rot/Blau/
  Gelb/FeuerRot/BlattGrün), Johto (Gold/Silber/Kristall/HG-SS) und Hoenn (Rubin/Saphir/Smaragd/Omega
  Rubin/Alpha Saphir) korrigiert. Methode, die sich bewährt hat und für künftige Editionen empfohlen
  wird: nicht nur eine Bulbapedia-Walkthrough-Fließtext-Zusammenfassung lesen, sondern JEDEN Standort
  einzeln über die "Connecting areas"-Angabe seiner eigenen Bulbapedia-Ortsseite prüfen - die
  Fließtext-Methode allein hatte mehrere Fälle übersehen (z.B. Hoenns Route 117, Johtos Route 46/45/
  Route 33/34), bei denen ein Standort neben Nachbarn stand, zu denen er gar keine Verbindung hat.
  **Noch offen:** Sinnoh, Einall, sowie die generationsübergreifende Frage, ob ähnliche
  "Connecting-areas"-Nachrecherchen auch bei den bereits per Fließtext-Methode geprüften Abschnitten
  von Sinnoh/Einall neue Funde brächten (analog zur Kanto/Johto/Hoenn-Erfahrung) - noch nicht
  begonnen, voraussichtlich erst im nächsten Chat ab Version 2.0. Alola/Galar (komplette Neu-
  recherche nötig, siehe eigener Backlog-Punkt oben) sollten die Reihenfolge gleich mitprüfen.
  **Bewusst NICHT korrigiert** (siehe `order-gen1-3.md` für Details): Hoenns Route 115 und die
  Reihenfolge zwischen Kantos zwei parallelen Fuchsania-Zugängen (Route 12-15 vs. 16-18) - kein
  hartes Freischalt-Gate gefunden, das eine eindeutige Position erzwingt.
- **Zwei Nebenfunde aus der Gen-1-3-Reihenfolge-Recherche, beide KEINE Reihenfolgefragen, eigener
  Audit nötig:**
  1. **Route 47/Route 48 (Johto) existieren laut Bulbapedia nur in HeartGold/SoulSilver**, tauchen im
     Code aber auch in `GSC_LOCATIONS` auf (die 1:1 auch für Original-Gold/Silber/Kristall gilt, wo es
     diese Routen/die dortige Safari Zone laut Bulbapedia gar nicht gibt). Existenz-, kein
     Reihenfolgefehler - unangetastet gelassen.
  2. **Boss "chuck" (Kampforden) ist in `BOSS_AFTER`/`GSC_BOSS_AFTER` an "Strudelinseln" (Whirl
     Islands) gebunden**, nicht an eine Cianwood-Stadt wie im echten Spiel. Fiel auf, weil der
     Rechercheagent fälschlich annahm, chuck hänge an "Oliviana City" (stimmt laut Code nicht) - beim
     Gegenchecken der tatsächlichen `bossAfter`-Keys kam die eigentliche Diskrepanz ans Licht. Bewusst
     NICHT korrigiert, da unklar ist, welche Stadt tatsächlich Cianwood ist (siehe Punkt 3) - erst
     klären, dann `chuck`s `bossAfter`-Bindung korrigieren, nicht umgekehrt.
  3. **Mögliche Namensverwechslung "Anemonia City"/"Oliviana City"** (Johto): laut PokéWiki ist
     "Anemonia City" die deutsche Bezeichnung für Cianwood City und "Oliviana City" für Olivine City -
     die App bindet Jasmine (Stahlorden) aktuell an "Anemonia City" und lässt "Oliviana City"
     ordensfrei, was genau umgekehrt zum PokéWiki-Befund wäre. Ursprung: `order-gen1-3.md` Abschnitt
     4.3. Eigener Namens-/Bossaudit nötig, bevor Punkt 2 oben angegangen wird.

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
