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
  **Service-Worker-Cache-Falle, behoben in v1.9.65 (Nutzerfund):** `pwa/sw.js`s `CACHE_NAME` blieb
  zwischen v1.9.49 und v1.9.65 (16 Versionen: Standort-Suche, Regions-Karte, Zurückstellen für
  Bosse, Cloud-Sync-Umbenennung+QR+PIN, Hoenn-Karte, Urzeithöhle) unverändert. Der `fetch`-Handler
  ist cache-first OHNE Versions-Check, und `activate` löscht nur ANDERE Cache-Namen - blieb der
  eigene Name gleich, wurde die einmal gecachte `index.html` nie ersetzt, selbst wenn der Browser
  wegen eines Byte-Diffs in `sw.js` (o.Ä.) brav ein neues Service-Worker-Skript installierte. Eine
  bereits installierte PWA konnte dadurch über ein Dutzend Versionen lang unbemerkt denselben
  veralteten Stand zeigen, komplett unabhängig davon, ob das ZIP frisch gebaut und auf Netlify
  gezogen wurde. Aufgefallen, als der Nutzer meldete, ein gerade committeter Kartenpunkt
  (Urzeithöhle) fehle "auch in der Karte" - der Code war zu diesem Zeitpunkt längst korrekt (per
  Playwright direkt gegen die Quelldatei verifiziert), der Unterschied lag ausschließlich am
  service-worker-seitigen Cache der installierten App. **Behoben nicht nur punktuell, sondern an der
  Wurzel:** `tools/build-netlify-zip.js` überschreibt `CACHE_NAME` beim Staging jetzt automatisch mit
  der aktuellen `APP_VERSION` (Regex-Ersetzung beim Kopieren von `sw.js` in den Staging-Ordner,
  Konsolenausgabe zur Kontrolle) - der im Repo committete Wert in `pwa/sw.js` ist dadurch nur noch
  der Stand des letzten Builds, keine eigene Quelle der Wahrheit mehr, und diese Bugklasse kann nicht
  mehr durch Vergessen wiederkehren. **Lehre für Fehlerdiagnosen bei der installierten PWA:** wirkt
  ein frisch committeter/verifizierter Fix im Code korrekt, zeigt sich aber nicht in der installierten
  App, zuerst den Service-Worker-Cache verdächtigen (Browser-DevTools → Application → Service Workers/
  Cache Storage, oder schlicht Neuinstallation), bevor an der eigentlichen Datenlogik weitergesucht
  wird - Netlifys fehlendes Auto-Deploy (s. o.) und der SW-Cache sind zwei GETRENNTE mögliche
  Ursachen für "Änderung kommt nicht an", beide gegenprüfen.
- **Supabase-Backend für Cloud-Sync (seit v1.8.57, seit v1.9.61 auch für Kurz-PINs)** — LIEGT NICHT
  IM REPO, sondern als separates Cloud-Projekt bei Supabase, Projekt-ID `cyaanqljqxzsqlzeaaev`
  (identisch mit der `SUPABASE_URL`-Konstante in `nuzlocke-v2-editionen.html`), erreichbar über das
  Supabase-MCP-Tool dieser Sitzung (`list_projects`/`list_tables`/`execute_sql`/`apply_migration`/
  `get_advisors`). Schema: Tabelle `nuzlocke_saves` (`sync_code` PK, `data` jsonb, `updated_at`) für
  den eigentlichen Cloud-Spielstand, seit v1.9.61 zusätzlich `nuzlocke_pairing_pins` (`pin` PK,
  `sync_code`, `expires_at`) für kurzlebige Kurz-PINs - beide RLS-aktiv OHNE Policies (Default-Deny),
  Zugriff ausschließlich über SECURITY-DEFINER-RPC-Funktionen (`nuzlocke_get_save`/`nuzlocke_put_save`/
  `nuzlocke_create_pairing_pin`/`nuzlocke_resolve_pairing_pin`), die dem `anon`-Schlüssel aus der App
  heraus per REST-RPC-Aufruf zur Verfügung stehen (kein Supabase-JS-SDK, nur `fetch()`, siehe
  Code-Kommentar über `SUPABASE_URL`). Schema-Änderungen bewusst per `apply_migration` (nicht rohes
  `execute_sql`) vornehmen, damit sie in `list_migrations` nachvollziehbar bleiben - Details/
  Funktionsdefinitionen bei Bedarf per `execute_sql` gegen `pg_proc`/`information_schema` abfragen,
  nicht aus dem Gedächtnis rekonstruieren. **Nach jeder Schema-Änderung `get_advisors(type:"security")`
  laufen lassen** - die erwarteten "anon kann SECURITY DEFINER ausführen"-Hinweise für die vier
  Funktionen sind Absicht (Kernprinzip dieses Sync-Modells: kein Login, wer den Code/PIN kennt, kommt
  rein), ein NEUER, andersartiger Hinweis wäre dagegen ein echtes Warnsignal. Beim Testen gegen das
  Live-Projekt entstehende Test-Zeilen (Sync-Codes/PINs) hinterher wieder per `execute_sql` löschen -
  NIE die 5 (Stand v1.9.61) echten, vom Nutzer selbst erzeugten Spielstand-Zeilen anfassen (vor dem
  Löschen immer erst `sync_code`/`updated_at`/Edition gegenprüfen, ob es die eigene Test-Zeile ist).
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
  **Auf Bosskämpfe ausgeweitet (seit v1.9.59):** Nutzerwunsch - man macht ggf. erst einen anderen Weg
  (grinden o.Ä.), bevor man sich einem Arenaleiter/Bosskampf stellt. `bossCardHtml()` bekommt jetzt
  (nur wenn `!defeated`) denselben `toggle-loc-manual-collapse`-Button wie Standortkarten, mit
  `boss.id` statt `loc.id` - `state.manualCollapsedLocs` ist ohnehin nur eine generische ID-Liste,
  kein Umbau nötig. Alle Stellen, die vorher `tile.kind==="loc"` als Bedingung für die
  Stash-Zugehörigkeit prüften (`renderRoutes()`, `expandCollapseGroupsForLocation()`), wurden von
  dieser Einschränkung befreit - reine Mitgliedschaft in `manualCollapsedLocs` entscheidet jetzt,
  unabhängig vom Kachel-Typ. `expandCollapseGroupsForLocation()` iteriert dafür jetzt über ALLE
  Regionen der Edition statt nur über `loc.region` einer gefundenen `state.locations`-Kachel, da eine
  Boss-ID keinen eigenen `state.locations`-Eintrag hat - ihre Region ergibt sich erst aus der
  `locationTiles()`-Zuordnung des Standorts, an dem der Boss über `bossAfter` hängt.
  `stashOverviewResultsHtml()` löst IDs seither erst gegen `state.locations`, dann gegen `bossById()`
  auf. Der `toggle-loc-manual-collapse`-Klick-Handler suchte die Kachel für die Flug-Animation bisher
  nur über `t.closest("[data-loc]")` - für Boss-Karten (`data-boss`) griff das nicht, jetzt
  `t.closest("[data-loc], [data-boss]")`. Texte generalisiert: "X später fangbare Standorte" →
  "X zurückgestellte Kacheln" (Sammelgruppe, Stash-FAB-Titel, Übersichts-Überschrift), da die Gruppe
  jetzt beide Kachel-Typen bündelt. Bewusst NICHT erweitert: `finalRivalCardHtml()` (Ruhmeshallen-
  Duell) - steht immer ganz am Ende, Zurückstellen ergibt dort keinen praktischen Sinn.
  **Regression, behoben in v1.9.69 (Nutzerfund):** trotz der v1.9.59-Erweiterung wirkte das
  Zurückstellen bei Bossen rein optisch NICHT - Nutzerfeedback: "sie verschieben zwar in den dafür
  vorgesehenen Tab, allerdings werden sie immer noch angezeigt danach, als wären sie nicht
  eingeklappt worden." Ursache: `locationTiles()` (Zeile ~7418) vergab dem internen Kachel-Objekt für
  Boss-Kacheln (`tiles.push({ html: h, resolved: ..., kind:"boss" })`) NIE ein `id`-Feld - anders als
  bei Standort-Kacheln, die von Anfang an `id: loc.id` mitbekommen. `renderRoutes()`s
  Zugehörigkeits-Check `(state.manualCollapsedLocs||[]).includes(tile.id)` verglich dadurch für jeden
  Boss immer gegen `undefined`, was nie zu einem Treffer in `manualCollapsedLocs` (das reale IDs
  enthält) führen konnte - die Kachel landete deshalb IMMER im `else`-Zweig (inline rendern), egal ob
  sie tatsächlich zurückgestellt war. Der Klick selbst hatte trotzdem sichtbare Nebenwirkungen (ID
  landete korrekt in `state.manualCollapsedLocs`, der Stash-FAB erschien, die Übersicht listete den
  Boss korrekt auf) - nur die Routenliste selbst ignorierte das. Betraf aus demselben Grund auch
  `expandCollapseGroupsForLocation()` (nutzt denselben `tiles.find(t=>t.id===targetId)`-Abgleich, um
  beim Antippen eines Suchtreffers/Kartenpunkts die richtige Sammelgruppe vorab aufzuklappen) - ein
  Sprung zu einem bereits erledigten ODER zurückgestellten Boss klappte dadurch nie die passende
  Gruppe automatisch auf. Fix: beiden `tiles.push(...)`-Aufrufen in `locationTiles()` (regulärer
  Boss UND `finalRivalCardHtml`-Zweig) `id: boss.id` ergänzt. **Lehre:** ein Kachel-Objekt, das
  zwei verschiedene Kachel-Arten (`kind:"loc"`/`kind:"boss"`) über gemeinsamen Code (hier:
  `renderRoutes()`s Bucket-Logik) verarbeitet, braucht bei jeder neuen `kind`-Variante dieselben
  Pflichtfelder wie die bereits funktionierende - ein Feld, das nur bei einer Variante fehlt, fällt
  beim Draufschauen auf den Code leicht nicht auf (die Kachel wird ja trotzdem korrekt gerendert,
  nur ihre spätere Einsortierung schlägt lautlos fehl), aber sofort per Playwright auf, sobald man
  den tatsächlichen Bucket-Zielzustand nach einem Klick prüft statt nur "Klick löst keinen Fehler
  aus" zu verifizieren.
- **Cloud-Sync — Umbenennung + QR-Code (seit v1.9.60):** Nutzerfeedback "ich finde die Sync-Funktion
  nicht ganz verständlich" + "gibt es eine weniger umständliche Variante als die mit dem Code?".
  Buttons umbenannt: "Sync aktivieren" → **„Speichern"** (`data-act="create-sync-code"`), "Code eines
  anderen Geräts eingeben" → **„Laden"** (`data-act="open-link-sync-code"`) - bewusst NICHT an die
  bestehende lokale "Mehrfach-Speicherstände"-Terminologie angelehnt (wurde vor der Umsetzung als
  Verwechslungsrisiko benannt, Nutzer hat sich trotzdem für die kürzeren Begriffe entschieden, im
  Kontext der eigenen "Cloud-Sync"-Kartenüberschrift vertretbar). Historische Changelog-Einträge
  (v1.8.57 u.ä.), die die alten Button-Namen nennen, bewusst NICHT rückwirkend angepasst - sie
  beschreiben akkurat, wie es damals hieß.
  **QR-Code-Verknüpfung:** `qrCodeSvg(text, cellSize)` (kurz vor dem Cloud-Sync-Code definiert)
  erzeugt aus jedem String eine eigenständige Inline-SVG, IMMER schwarz auf weiß unabhängig vom
  Hell-/Dunkel-Theme der App (ein QR-Code braucht echten Kontrast zum zuverlässigen Scannen). Nutzt
  dafür `isDark(row,col)`/`getModuleCount()` der eingebetteten Bibliothek **"QR Code Generator for
  JavaScript" von Kazuhiko Arase** (MIT-lizenziert, https://github.com/kazuhikoarase/qrcode-generator)
  - bezogen über den npm-Unpkg-Mirror (`unpkg.com/qrcode-generator@1.4.4/qrcode.js`), da das
  GitHub-Repo selbst inzwischen auf ES-Module-Format umgestellt ist und keine klassische
  (Nicht-Modul-)Version mehr im Repo führt; die klassische `var qrcode = function(){...}`-Variante
  lässt sich dagegen unverändert als eigener `<script>`-Block einbetten (siehe Kommentar direkt davor
  in der Datei) - **kein CDN**, bleibt Single-File-konform (gleiches Prinzip wie beim Verzicht auf das
  Supabase-JS-SDK). Angezeigt an drei Stellen: `openSyncActivatedSheet()` (direkt nach „Speichern"),
  der bereits-aktiv-Zustand von `cloudSyncCardHtml()` (damit ein WEITERES Gerät jederzeit ohne
  erneuten Tastendruck gescannt werden kann) und implizit in `openLinkSyncCodeSheet()`s Hinweistext
  (erklärt, dass Scannen das Fenster automatisch mit vorausgefülltem Code öffnet - nutzt den
  bestehenden `#sync=CODE`-Link-Mechanismus, der QR-Code kodiert exakt `syncShareUrl(code)`, keine
  neue URL-Form). Kein eigener In-App-Scanner nötig: die normale Kamera-App des Betriebssystems
  erkennt den QR-Code und öffnet den enthaltenen Link direkt, der beim Laden per `syncLinkMatch`
  (Dateiende) ohnehin schon automatisch `openLinkSyncCodeSheet()` mit vorausgefülltem Code öffnet -
  bereits vor dieser Version für den "Teilen"-Link-Fall gebaut, jetzt zusätzlich für den QR-Code-Fall
  wiederverwendet. Verifiziert per Playwright + `pyzbar`-Dekodierung eines Screenshots (echter
  Scan-Test, nicht nur visuelle Kontrolle) - ergab exakt den erwarteten `#sync=`-Link.
  **Kurzer PIN als weitere Alternative (seit v1.9.61):** Nutzerfrage "der QR-Code funktioniert aber
  nur mit Kamera, was gäbe es für Alternativen? evtl. Login mit Benutzername/Passwort?" - Login
  bewusst verworfen (mehr Tipp-/Verwaltungsaufwand als der bestehende Code, zusätzliche
  Sicherheitsfläche ohne echten Nutzen hier), stattdessen ein kurzer numerischer PIN. Neue Supabase-
  Tabelle `nuzlocke_pairing_pins` (`pin` PK, `sync_code`, `expires_at`) + zwei SECURITY-DEFINER-RPC-
  Funktionen, per `apply_migration` (Supabase-MCP) direkt auf das Live-Projekt `cyaanqljqxzsqlzeaaev`
  angewendet (Migrationen: `add_pairing_pin_for_sync`, `fix_ambiguous_expires_at_in_create_pairing_pin`
  - letztere behebt einen Fehler der ersten Fassung, siehe unten):
  `nuzlocke_create_pairing_pin(p_sync_code)` löscht zuerst abgelaufene PINs sowie alle noch aktiven
  PINs desselben `sync_code` (immer nur ein aktiver PIN pro verknüpftem Spielstand), erzeugt dann per
  Schleife+`unique_violation`-Abfangen einen freien 6-stelligen PIN mit 10-Minuten-Ablauf;
  `nuzlocke_resolve_pairing_pin(p_pin)` räumt ebenfalls abgelaufene PINs auf, liefert bei Treffer den
  zugehörigen `sync_code` zurück und LÖSCHT den PIN sofort (Einmalgebrauch - verhindert Wiederverwendung/
  Erraten innerhalb des Zeitfensters). Bewusst dieselbe RLS-Default-Deny-Architektur wie
  `nuzlocke_saves` (RLS aktiv, keine Policies, Zugriff ausschließlich über die beiden RPCs) -
  `get_advisors` meldet dieselben (erwarteten) "anon kann SECURITY DEFINER ausführen"-Hinweise wie für
  die beiden bereits bestehenden Funktionen, kein neues Risiko gegenüber dem bestehenden Modell.
  App-seitig: `showPairingPin()`/`openPairingPinSheet()` (Button "Kurzen PIN anzeigen" in
  `syncCodeActionsHtml()`, sichtbar überall wo Code/QR schon erscheinen); `confirmLinkSyncCode()`
  erkennt automatisch eine rein 6-stellige Eingabe (Regex `/^\d{6}$/`) und ruft dafür zuerst
  `nuzlocke_resolve_pairing_pin` auf, bevor der aufgelöste (oder bei einer Nicht-PIN-Eingabe
  unveränderte) Code wie gehabt an `pullCloudSave` geht - kein separater Umschalter im Eingabefeld
  nötig, das 10-stellige-Code-Feld akzeptiert beides.
  **Testmethodik, Lektion:** `validate-editions.js` prüft nur bis zum `injectEditionThemeCSS();`-
  Marker und hätte einen Syntaxfehler in später folgendem Code (z.B. im Cloud-Sync-Bereich) NICHT
  erkannt - ein Tippfehler (unescapter `"` in einem String, der eigentlich mit `"..."` statt
  Template-Literal `` `...` `` hätte geschrieben werden müssen) blieb dadurch zunächst unbemerkt.
  Ab jetzt bei Änderungen JENSEITS des Validierungs-Markers zusätzlich `node --check` auf den
  extrahierten `<script>`-Inhalt laufen lassen (siehe Vorgehen: Skript-Block per Regex aus der HTML-
  Datei ziehen, in eine `.js`-Datei schreiben, `node --check` darauf). Reale Supabase-RPC-Aufrufe
  (Erzeugen/Auflösen eines PINs, Konsum-Effekt) wurden zusätzlich direkt per `curl` gegen das
  Live-Projekt verifiziert (inkl. Aufräumen der dabei entstandenen Test-Zeilen in `nuzlocke_saves`
  hinterher) - Chromium/Playwright in dieser Sandbox kann echte HTTPS-Verbindungen zu Supabase NICHT
  aufbauen (`ERR_CERT_AUTHORITY_INVALID`, derselbe bereits bekannte Proxy-/Zertifikats-Sonderfall wie
  bei der Pokéos-Recherche weiter oben) - UI-seitige Logik (Regex-Erkennung, welche RPCs mit welchen
  Parametern aufgerufen werden, Fehlertexte) deshalb per Playwright mit `page.route()`-Mocking der
  RPC-Endpunkte getestet, DB-Verhalten (Ablauf, Einmalgebrauch, Nicht-gefunden-Fall) separat per
  direktem `curl`.
  **Rückbau von "Jetzt synchronisieren" zu "Speichern"/"Laden" + Auto-Save-Schalter (seit v1.9.78):**
  Nutzerfrage "cloud sync sollte doch mal speichern und laden als buttons beinhalten was ist mit
  denen passiert?" - Ursache: `cloudSyncCardHtml()` zeigte "Speichern"/"Laden" NUR im noch nicht
  verknüpften Zustand (`!state.syncCode`); war Sync bereits aktiv, gab es nur noch einen einzigen
  Button "Jetzt synchronisieren" (`runSyncFlow()` - zog erst den Cloud-Stand, verglich
  `lastSyncedAt` gegen `updated_at` und zeigte bei Abweichung `openSyncConflictSheet()` mit
  "Cloud-Version übernehmen"/"Lokale Version behalten" zur Auswahl, sonst schrieb es direkt). Nutzer
  wollte stattdessen wieder die zwei einfachen, immer sichtbaren Aktionen, auch wenn Sync bereits
  aktiv ist - **kompletter Ersatz, nicht Ergänzung**: `runSyncFlow()`, `openSyncConflictSheet()`,
  `progressSummary()` und `pendingSyncRemote` vollständig entfernt (samt der zugehörigen
  `use-cloud-save`/`use-local-save`-Klick-Handler), da sie sonst als tote Anschlussstellen ohne
  jeden Aufrufer im Code stehen geblieben wären. Neue Funktion `saveToCloud()`
  (`data-act="save-to-cloud"`) pusht ohne jeden Vergleich direkt den lokalen Stand unter dem
  bestehenden Code - fällt auf `createSyncCode()` zurück, falls (praktisch nie über diesen Button
  erreichbar) noch gar kein Code existiert. "Laden" (`data-act="open-link-sync-code"`) nutzt jetzt
  bei bereits aktivem Sync denselben Dialog wie beim Erstverknüpfen, aber mit dem eigenen
  `state.syncCode` als `data-id` vorausgefüllt (der Klick-Dispatcher reicht `id = t.dataset.id` an
  `openLinkSyncCodeSheet(id)` durch) - bewusst weiterhin ÄNDERBAR im Eingabefeld, nicht schreibgeschützt,
  damit sich darüber auch auf einen komplett anderen Code umspringen lässt (z. B. um versehentlich
  falsch verknüpft zu haben). Beide Aktionen überschreiben ohne Rückfrage die jeweils andere Seite -
  das ist so gewollt (explizite Nutzerentscheidung statt automatischer Konflikterkennung), im
  Hilfetext (`SETTINGS_HELP.cloudsync`) entsprechend als "wer zuletzt speichert/lädt gewinnt"
  erklärt.
  **QR-Code nur noch auf Antippen:** zweiter Teil derselben Nutzeranfrage - "der qr code muss nicht
  ständig sondern nur bei bedarf angezeigt werden". Der permanente `qrCodeSvg(...)`-Aufruf sowohl in
  `cloudSyncCardHtml()` (aktiver Zustand) als auch in `openSyncActivatedSheet()` (Sheet direkt nach
  dem Erstellen eines Codes) wurde entfernt - `syncCodeActionsHtml()` bekam stattdessen einen
  vierten Button "QR-Code anzeigen" (`data-act="show-sync-qr"`, `data-id="<code>"`), der eine neue
  Funktion `openSyncQrSheet(code)` aufruft (eigenes kleines Sheet, nur der QR-Code selbst). Da
  `syncCodeActionsHtml()` bereits an beiden vorherigen QR-Stellen eingebunden war, war keine
  zusätzliche Einbindung nötig - nur die beiden direkten `qrCodeSvg(...)`-Aufrufe mussten raus.
  **Neuer Auto-Save-Schalter**, im selben Zug per Rückfrage geklärt (Trigger: sofort nach jeder
  Änderung statt Zeitintervall oder Beim-Schließen; eigener Ein/Aus-Schalter statt automatisch immer
  an, sobald Sync aktiv ist - Nutzerbegründung indirekt: Kontrolle über Mobilfunk-Datenverbrauch/
  Verhalten bei mehreren gleichzeitig genutzten Geräten bleibt beim Nutzer). Neues Datenfeld
  `state.autoSyncEnabled` (Default `false`, normalisiert in `normalizeState()` analog zu
  `syncCode`/`lastSyncedAt` direkt daneben), Checkbox in `cloudSyncCardHtml()`
  (`data-auto-sync-toggle`, `.check-row`-Muster wie bei den Hausregeln/Schlüsselitems) nur im
  bereits-aktiv-Zustand sichtbar (Auto-Save ohne bestehenden Sync-Code ergibt keinen Sinn). Zentral
  verdrahtet über `saveState()` selbst (`function saveState(){ writeSave(activeSaveId, state);
  scheduleAutoCloudSave(); }`) statt an einzelnen Änderungsstellen im Code verteilt - `saveState()`
  läuft ohnehin nach praktisch jeder Zustandsänderung im gesamten Code, ein einziger Anschlusspunkt
  genügt dadurch. `scheduleAutoCloudSave()` bricht sofort ab, wenn der Schalter aus ist oder kein
  Sync-Code existiert, sonst setzt es einen 4-Sekunden-`setTimeout` (per `clearTimeout` bei jedem
  erneuten Aufruf verworfen und neu gestartet - klassisches Debounce, mehrere schnelle Änderungen
  hintereinander lösen dadurch nur einen einzigen Push aus, nicht einen pro Änderung). **Wichtige
  Falle, beim Schreiben direkt vermieden:** der Timer-Callback selbst darf `state.lastSyncedAt`
  NICHT über `saveState()` wegschreiben, sondern muss direkt `writeSave(activeSaveId, state)`
  aufrufen - sonst würde dieser interne Schreibvorgang wiederum `scheduleAutoCloudSave()` erneut
  auslösen und einen Endlos-Alle-4-Sekunden-Push in Gang setzen, obwohl gar keine echte
  Nutzeränderung mehr stattgefunden hat. Bewusst kein Ergebnis-Sheet nach einem Auto-Save (anders als
  bei manuellem "Speichern") - ein Fehlschlag wird beim nächsten Änderungs-Tick automatisch erneut
  versucht, sichtbar nur indirekt über einen veralteten "Zuletzt synchronisiert"-Zeitstempel in der
  Karte. Beim manuellen "Sync trennen" wird der Schalter mit zurückgesetzt
  (`state.autoSyncEnabled = false`) und ein eventuell noch laufender Timer per `clearTimeout`
  verworfen, damit nach dem Trennen kein verspäteter Push mehr auf den (dann u. U. schon
  überschriebenen) alten Code zielt. Verifiziert per Playwright mit gemocktem `supabaseRpc()`: drei
  schnell aufeinanderfolgende `saveState()`-Aufrufe lösten nachweislich nur einen einzigen
  `nuzlocke_put_save`-Aufruf aus (nicht drei), Ausschalten des Schalters verhinderte jeden weiteren
  Push zuverlässig.
- **Standort-Suche (seit v1.9.51):** Lupen-FAB im Routen-Tab öffnet ein Sheet
  (`openLocationSearchSheet()`), Live-Ergebnisliste (`locationSearchResultsHtml()`) respektiert
  bestehende Sichtbarkeits-Filter (`hiddenRegions`, `hidePostgame`). Antippen eines Treffers
  (`data-act="jump-to-location-result"`) klappt via `expandCollapseGroupsForLocation()` bei Bedarf die
  richtige Einklapp-Gruppe auf (repliziert dafür einmalig die Tile-Chunking-Logik aus `renderRoutes()`
  für die eine betroffene Region), rendert neu, scrollt zur Kachel und hebt sie kurz farbig hervor
  (`.search-highlight`, nutzt `--evolve-glow` nur als generischen Aufmerksamkeits-Farbton).
- **Regions-Karte (seit v1.9.52 Rot/Blau, seit v1.9.62 zusätzlich Rubin/Saphir/Smaragd):**
  dritter FAB (`mapFab`), nur sichtbar wenn `REGION_MAPS[currentGame().id]` existiert. Zwei Ansichten
  in einem Sheet umschaltbar (`mapViewMode`, `regionMapSheetHtml()`): "Kartengrafik" (Bulbagarden-
  Archiv-Bild, Standorte als absolut positionierte `%`-Punkte via `REGION_MAPS[editionId].points`)
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
  Pipeline).
  **Ausweitung auf Hoenn (seit v1.9.62):** Nutzerwunsch "lass uns als nächstes Hoenn machen (Johto
  kommt später, da es ja Johto & Kanto da gibt)" - Johto bewusst zurückgestellt, da es (anders als
  Hoenn) noch keine zweite bereits abgedeckte Referenz-Region gäbe, an der sich das Muster schon
  bewährt hat; Hoenn ist die logische zweite Runde. Rubin/Saphir/Smaragd teilen sich denselben
  Standort-Datensatz `SMARAGD_LOCATIONS` (77 Standorte, ein Region-Eintrag "Hoenn" - siehe
  `buildVersionGames(HOENN_RS_BOSSES, SMARAGD_LOCATIONS, ...)` für Rubin/Saphir), ORAS nutzt dagegen
  ein separates `ORAS_LOCATIONS` - deshalb `REGION_MAPS.rubin = REGION_MAPS.saphir =
  REGION_MAPS.smaragd` (Objektreferenz, keine Kopie: eine künftige Kalibrierung unter irgendeiner der
  drei Editionen aktualisiert automatisch alle drei), ORAS bewusst NICHT mit abgedeckt (eigener
  Datensatz, eigene Kalibrierungsrunde nötig, aus Aufwandsgründen zurückgestellt wie Johto).
  Kartenbild: `Hoenn ORAS Map.png` (Bulbagarden Archives, dieselbe Recherchemethode wie bei Kanto -
  Kategorie-Suche + Dateiseiten-Check auf Stil/Auflösung/Lizenz) - ein echtes Ingame-Kachelbild wie
  bei Kanto, aber nur 320×210px (kein Let's-Go-Äquivalent für Hoenn verfügbar) - jetzt unter
  `sprites/maps/hoenn-oras-map.png`. Nutzer nach Rückfrage (Vorschau geschickt) bewusst FÜR die
  Verwendung trotz niedrigerer Auflösung entschieden, statt nur Schema-Ansicht für Hoenn anzubieten.
  Geprüfte/verworfene Alternativen: die einzelnen `Hoenn <Ort> Town Map.png`-Dateien (alle ≤352×223,
  nur Einzelstandorte, kein Vollbild); keine gemalte Artwork-Alternative gezielt gesucht, da das
  Stil-Kriterium (Kacheln statt Gemälde) inzwischen als hartes Muss gilt (Kanto-Präzedenzfall).
  Das anfängliche algorithmisch erzeugte 10×8-Platzhalter-Raster (gleichmäßig über 5-95% verteilt)
  diente nur als Übergangslösung, damit der Kalibrierungsmodus sofort nutzbar war, ohne dass zwei
  Punkte exakt übereinanderliegen (Lektion aus dem Kanto-Route-22-Vorfall, s.o.).
  **Kalibriert in v1.9.63:** alle 77 Punkte durch vom Nutzer per Kalibrierungsmodus abgetippte
  Koordinaten ersetzt, analog zu Kanto - die Punkte folgen jetzt sichtbar Küstenlinie/Straßen der
  Kartengrafik statt eines Rasters. Da `REGION_MAPS.rubin`/`.saphir` per Objektreferenz auf
  `REGION_MAPS.smaragd` zeigen, gilt die Kalibrierung automatisch für alle drei Editionen.
  **Auf Omega Rubin/Alpha Saphir ausgeweitet (seit v1.9.64):** Nutzerfrage "prüfe ob man dieselbe
  Karte auch für OR/AS verwenden kann oder ob dann Orte fehlen" - per direktem Codevergleich beider
  Arrays beantwortet, nicht geraten: `ORAS_LOCATIONS` wird per `.map()` aus `SMARAGD_LOCATIONS`
  abgeleitet (siehe Zeile bei `const ORAS_LOCATIONS`), weicht aber in genau 3 von 79 Standorten ab -
  1) "Schiffswrack" → "Seewoge Malvenfroh" (ORAS-exklusiv umbenannt, exakt derselbe reale Ort, taucht
  aber nie in derselben Editions-Standortliste gleichzeitig mit "Schiffswrack" auf - deshalb bewusst
  IDENTISCHER Punkt zulässig, kein Widerspruch zur Route-22-Regel, die nur für zwei Standorte
  INNERHALB derselben Editionsliste gilt); 2) `{name:"Route 103 (Postgame)", ...}` und 3)
  `{name:"Blütenburg City (Delta-Episode)", ...}` - zwei zusätzliche, in ORAS_LOCATIONS direkt
  angehängte Delta-Episode-Postgame-Standorte (siehe `ORAS_BOSS_AFTER`), die es in Rubin/Saphir/
  Smaragd gar nicht gibt. Für diese beiden (anders als Fall 1: sie koexistieren mit ihrem jeweiligen
  Basis-Standort IN DERSELBEN ORAS-Standortliste) bewusst NICHT dieselben Koordinaten wie "Route 103"
  bzw. "Blütenburg City" vergeben, sondern leicht versetzte (Kanto-Route-22-Lektion: exakt
  übereinanderliegende `<button class="map-pin">`-Elemente machen das zuerst gerenderte untappbar) -
  ohne neue Kalibrierungsrunde, nur ein kleiner manueller Versatz in der Nähe des jeweiligen
  Basis-Punkts. `REGION_MAPS.omegarubin`/`.alphasaphir` zeigen jetzt ebenfalls per Objektreferenz auf
  `REGION_MAPS.smaragd` (identisches Muster wie rubin/saphir) - alle 79 ORAS-Standorte haben dadurch
  einen eigenen Punkt, per Playwright verifiziert (Pin-Anzahl, keine fehlenden Punkte, alle vier
  betroffenen Paare - Route 103/Route 103 (Postgame), Blütenburg City/Blütenburg City
  (Delta-Episode) - unabhängig antippbar und springen zur jeweils richtigen, unterschiedlichen
  Kachel). Ausweitung auf weitere Editionen/Regionen darüber hinaus (Johto, alles jenseits
  Kanto+Hoenn) bewusst weiterhin zurückgestellt.
  **Vollbild-Vergrößerung per Tap (seit v1.9.68):** Nutzerfeedback nach Prüfung aller Karten: "cool
  aber zu klein für Touchscreen." `toggleMapZoom(gameId)` (Muster wie `showGameOverOverlay()` - reine
  DOM-Existenz statt eigener State-Variable entscheidet offen/geschlossen) erzeugt ein `.map-zoom-
  overlay` über der gesamten Seite (z-index über dem Sheet), das dieselbe `artworkMapHtml(gameId,
  true)`-Markup wiederverwendet, nur über eine deutlich größere feste Breite (`220vw`, gedeckelt auf
  `max-width:1100px`). `artworkMapHtml()` bekam dafür einen zweiten `zoomed`-Parameter: im kleinen
  Sheet-Preview trägt der `.artwork-map`-Container selbst `data-act="toggle-map-zoom"` (ein Tap
  irgendwo außerhalb eines Pins öffnet die Vergrößerung - ein Pin-Tap gewinnt dank `closest()`-
  Priorität weiterhin normal), in der Vollbild-Ansicht bewusst NICHT (ein Tap auf die Karte dort
  bubbelt zum `data-act` des umschließenden Overlays durch und schließt es wieder - symmetrisches
  Verhalten ohne zwei verschiedene Interaktionen lernen zu müssen). Kleines Lupen-Symbol
  (`.map-zoom-hint`, `pointer-events:none`) unten rechts auf der kleinen Kartengrafik als visueller
  Hinweis, dass sie tappbar ist. `closeSheet()` räumt ein offenes Zoom-Overlay vorsorglich mit auf
  (falls der Nutzer z. B. per Android-Zurück-Geste das Sheet schließt, während die Vergrößerung noch
  offen ist), sonst bliebe es als Deckel über einer bereits geschlossenen Oberfläche hängen.
  **CSS-Falle beim Umsetzen, per Playwright entdeckt und behoben:** die naheliegende erste Fassung
  von `.map-zoom-scroll` nutzte `display:flex; justify-content:center`, um die (oft schmalere als
  220vw breite) Karte auf breiten Bildschirmen zu zentrieren. Bei einer Karte, die breiter als der
  Container ist, steht sie dabei links UND rechts gleich weit über - `scrollLeft` kann aber nicht
  unter 0 gehen, wodurch der linke Überstand (samt seinen Standort-Punkten, z. B. "Wurzelheim" bei
  Hoenn) dauerhaft unerreichbar geworden wäre, ganz gleich wie weit gescrollt wird. Playwright-Test
  bestätigte das direkt (`imgBox.x` negativ, `scrollLeft` blieb bei 0 hängen). Fix: kein Flexbox-
  Centering, sondern normales Block-Layout mit `margin:0 auto` auf der Karte selbst - bei Überlauf
  lösen Browser `auto`-Margins nach CSS2.1 10.3.3 auf 0 auf (bündig links, voll von 0 bis
  `scrollWidth-clientWidth` scrollbar), bei genug Platz (z. B. Tablet) bleibt die Zentrierung
  trotzdem erhalten. **Lehre für künftige scrollbare/zentrierte Container mit potenziell
  überlaufendem Inhalt:** `justify-content:center`/`align-items:center` per Flex/Grid vermeiden,
  `margin:auto` auf dem Kind in normalem Block-Fluss bevorzugen - sonst bei jeder neuen Karte (auch
  bei künftigen Regionen) erneut prüfen, ob wirklich der komplette Inhalt erreichbar bleibt, nicht
  nur die optische Zentrierung stimmt.
  **Größere Antipp-Ziele in der Vollbild-Ansicht (seit v1.9.75):** Nutzerwunsch "die Punkte sollen
  auch klickbar sein wenn die Karte vergrößert ist" - der Tap-Mechanismus selbst war zu diesem
  Zeitpunkt bereits nachweislich funktionsfähig (per Playwright inkl. `page.touchscreen.tap()`,
  Chromiums realistischste Touch-Emulation, verifiziert), aber `.map-pin` hat eine feste CSS-Pixel-
  Größe (15px, 19px fürs `.current`) statt einer relativen - die Vollbild-Vergrößerung selbst
  schafft dadurch nur mehr ABSTAND zwischen benachbarten Punkten (Prozent-Koordinaten auf einer
  breiteren Karte), macht aber keinen einzelnen Punkt für sich größer. Für einen echten Finger blieb
  das Ziel selbst also weiterhin klein. Fix: `.map-zoom-overlay .map-pin{ width:26px; height:26px;
  ...}` (32px fürs `.current`) - reine CSS-Regel, die nur innerhalb der Vollbild-Ansicht greift,
  kein JS-Eingriff nötig. **Lehre:** "vergrößert" kann zwei unterschiedliche Dinge bedeuten, die
  leicht verwechselt werden - mehr Abstand zwischen Elementen (was reines Scale-up einer Karte mit
  fixgrößigen Overlay-Elementen liefert) ist nicht dasselbe wie größere Antipp-Ziele für die
  Elemente selbst; bei UI mit fixgrößigen Overlays auf einer skalierten Fläche beides einzeln prüfen.
  **Routen als Klickflächen statt Einzelpunkte (seit v1.9.76):** Nutzeridee im Anschluss an die
  Antipp-Ziel-Vergrößerung oben - statt jede Route auf einen einzelnen Punkt zu reduzieren, sollen die
  vier Ecken einer Route abgetippt werden, sodass die GANZE Route als Klickfläche reagiert. Sonderorte
  (Städte, Höhlen, Türme - alles ohne `"Route "`-Namenspräfix) bleiben bewusst einzelne Punkte, da sie
  im echten Spiel kompakte, punktförmige Ziele sind, keine langen Pfade. Nutzer entschied sich explizit
  für die aufwändigere 4-Ecken-Variante statt der einfacheren, zuvor vorgeschlagenen 2-Tap-Variante
  (Anfang+Ende, automatisch abgeleitetes schmales Rechteck) - mehr Kalibrierungsaufwand pro Route,
  dafür präzisere Passform auch bei winkligen/breiten Routen.
  **Datenmodell:** `REGION_MAPS[...].points[name]` akzeptiert jetzt zwei Formen - ein Array `[x,y]`
  (Punkt, wie bisher, unverändert für alle bereits kalibrierten Orte) ODER ein Objekt
  `{quad:[[x1,y1],[x2,y2],[x3,y3],[x4,y4]]}` (Vierergebiet, Eckreihenfolge egal). Alle drei Konsumenten
  (`artworkMapHtml()`, `mapCalibrationHtml()`, der `calibration-tap`-Handler) unterscheiden per
  `Array.isArray(...)`, welche Form vorliegt - reine additive Erweiterung, kein bestehender kalibrierter
  Punkt musste migriert werden.
  **Rendering:** eine Fläche wird als `<button class="map-quad">` mit `position:absolute; inset:0`
  (nimmt die komplette Kartenfläche ein) plus `clip-path: polygon(${Ecken}%)` gerendert - `clip-path`
  beschränkt in allen modernen Browsern nicht nur die sichtbare Füllung, sondern auch den Klick-/
  Antipp-Bereich selbst auf die tatsächliche Polygonform, nicht nur die (unsichtbare) Bounding-Box
  drumherum. Per Playwright mit einer absichtlich windschiefen Testform (Raute statt Rechteck)
  verifiziert: ein Tap in einer Bounding-Box-Ecke AUSSERHALB der Raute trifft daneben (fällt durch zum
  `toggle-map-zoom` der Karte darunter), ein Tap in der Mitte der Raute trifft (springt zur Kachel,
  hebt sie hervor) - bestätigt, dass die Formgenauigkeit nicht nur bei einfachen Rechtecken funktioniert.
  **Wichtige Reihenfolge-Regel, direkt aus der Route-22-Lektion abgeleitet:** Flächen werden in
  `artworkMapHtml()` IMMER vor Punkten ins HTML geschrieben, unabhängig von ihrer Reihenfolge in
  `REGION_MAPS[...].points` - eine Fläche belegt denselben vollen `inset:0`-Container wie ein Punkt,
  läge sie im DOM NACH einem Punkt, der zufällig innerhalb ihrer Ecken liegt (z.B. eine Stadt direkt an
  einer Route), würde sie dessen Klicks abfangen. Dieselbe Lektion wie beim Kanto-Route-22-Vorfall
  (spätere Elemente gewinnen bei sich überschneidenden absolut positionierten Klickzielen), nur diesmal
  Fläche-über-Punkt statt Punkt-über-Punkt.
  **Kalibrierungsmodus-Erweiterung:** `isRouteCalibrationName(name)` (reiner `"Route "`-Präfix-Check)
  entscheidet, ob die aktuelle Kalibrierungs-Station 1 Tap (Punkt) oder 4 Taps (Fläche, gesammelt in
  `calibrationQuadBuffer`) braucht. Eigener Fortschrittstext ("Ecke X von 4 für {Name}") statt "Punkt X
  von Y", nummerierte Ecken-Marker (`.map-corner-dot`, farblich von den grauen "erledigt"-Markern
  abgesetzt) zeigen die bereits getippten Ecken der LAUFENDEN Fläche. "Zurück" wird kontextabhängig zu
  "Ecke zurück", solange die aktuelle Fläche noch unvollständig ist (nimmt dann nur die letzte Ecke aus
  dem Buffer statt zur vorherigen Station zu springen) - bei leerem Buffer wie gehabt eine Station
  zurück. "Überspringen"/"Neu starten" leeren den Buffer immer mit. Export-Textfeld formatiert Flächen
  als `"Name":{quad:[[x,y],...]}`-Literal, direkt einfügbar in `REGION_MAPS`, exakt wie bisher bei
  Punkten.
  **Kanto-Routen kalibriert (v1.9.77):** Nutzer hat alle Kanto-Routen per 4-Tap-Kalibrierung
  abgetippt - jede "Route N" (plus "Route 22 (Rückweg)") hat jetzt eine echte Vierecksfläche statt
  eines Punkts, restliche Standorte unverändert Punkte. **Regression beim Verifizieren gefunden,
  genau der vor der Umsetzung befürchtete Fall:** "Route 22" und "Route 22 (Rückweg)" verlaufen über
  dieselbe reale Straße - ihre eingereichten Flächen überlappten sich dadurch fast vollständig
  (geometrisch nachgemessen: nur ~4% von "Route 22"s Fläche lagen außerhalb von "Route 22
  (Rückweg)"s Fläche). Wegen der DOM-Reihenfolge-Regel (später gerenderte Fläche gewinnt bei
  Überlappung, s. o.) war "Route 22" dadurch auf fast seiner gesamten Fläche untappbar - exakt die
  Kanto-Route-22-Lektion von v1.9.58, nur diesmal in Flächen- statt Punktform. Nutzerentscheidung
  (Rückfrage): "Route 22 (Rückweg)" bleibt bewusst ein einzelner PUNKT statt einer Fläche - explizite
  Ausnahme von der sonst reinen `"Route "`-Namenspräfix-Regel für den Kalibrierungsmodus
  (`isRouteCalibrationName()` würde ihr weiterhin eine Fläche anbieten, das REGION_MAPS-Datenmodell
  erlaubt aber ohnehin beide Formen pro Eintrag unabhängig vom Namen). Begründung: sie ist nur ein
  einmaliger, fangfreier Rückweg-Durchgang zur richtigen Platzierung von Giovannis Arenakampf in der
  Liste, keine eigenständig zu durchquerende neue Strecke - anders als bei den zwei ursprünglich
  identischen Punkt-Koordinaten in v1.9.58 reicht hier ein einzelner Punkt an geeigneter Stelle
  innerhalb von "Route 22"s Fläche, da Punkte laut DOM-Reihenfolge-Regel ohnehin immer NACH allen
  Flächen gerendert werden und so unabhängig von ihrer Position tappbar bleiben - nur der übliche
  kleine Radius um den Punkt herum (26px in der Vollbild-Ansicht, wie bei jedem anderen Punkt) löst
  weiterhin zum Rückweg auf, der Rest von "Route 22"s Fläche korrekt zu "Route 22". Verifiziert per
  Playwright: 25 Flächen + 25 Punkte (50 Standorte insgesamt), alle klickbar an der richtigen Stelle.
  **Lehre, über die reine Punkt/Punkt-Kollision aus v1.9.58 hinaus verallgemeinert:** die
  Route-22-Falle (zwei Standortnamen für denselben physischen Ort im Spiel) betrifft nicht nur exakt
  identische Punkt-Koordinaten, sondern jede Overlap-Situation zwischen zwei antippbaren Zielen an
  derselben realen Stelle - bei Flächen zusätzlich verschärft, weil zwei unabhängig kalibrierte
  Vierecke für denselben Ort naturgemäß einen Großteil ihrer Fläche teilen, nicht nur einen Punkt.
  Bei künftigen Editionen mit ähnlichen "Ort wird zweimal besucht"-Fällen (s. Datenmodell-Abschnitt
  oben zu `noCatch:true`) aktiv prüfen, ob eine der beiden Positionen besser ein Punkt statt einer
  Fläche bleibt, statt beide unbesehen als Fläche zu übernehmen.
  **Hoenn-Routen weiterhin nicht auf das Flächen-Format umkalibriert** - bewusst zurückgestellt, bis
  der Nutzer Zeit für die entsprechende Kalibrierungsrunde hat (analog zum ursprünglichen
  Kanto-Aufwand).
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
- **Rückgängig-Toast — Wegwischen in alle Richtungen (seit v1.9.70):** Nutzerwunsch "der
  Rückgängig-Button soll auf alle Richtungen weg geschoben werden und auch mit einer Animation."
  Bis dahin (seit v1.9.33) ließ sich `.undo-toast` nur seitlich wegwischen -
  `attachToastSwipeDismiss()` trackte nur `clientX`, und die CSS-Regel `touch-action:pan-y` überließ
  vertikales Wischen bewusst der nativen Seiten-Scroll-Geste, wodurch ein Hoch-/Runterwischen den
  Toast gar nicht erst erreichte. Jetzt `touch-action:none` (übergibt die volle Fläche der eigenen
  Logik) plus echtes Zwei-Achsen-Tracking (`curDx`/`curDy`, `Math.hypot()` für Gesamtdistanz und
  -geschwindigkeit statt nur `Math.abs(curDx)`) - der Toast folgt dem Finger in jede Richtung
  inklusive diagonal und fliegt beim Loslassen (Schwellwert weiterhin 80px Distanz ODER 0.5px/ms
  Geschwindigkeit) exakt in der gezogenen Richtung hinaus (`scale = 480/dist` auf `(curDx,curDy)`
  angewendet, statt vorher fest ±420px auf der X-Achse), bei zu kurzem Zug schnappt er weich zurück.
  Verifiziert per Playwright mit `hasTouch:true` + synthetisch erzeugten `new Touch(...)`/
  `new TouchEvent(...)`-Objekten (ein `{clientX, clientY}`-Objektliteral reicht dafür NICHT, `Touch`
  ist ein eigener Konstruktor) - vier Fälle geprüft: aufwärts, diagonal runter-rechts, diagonal
  hoch-links (jeweils Fliegen-Animation + tatsächliches Entfernen aus dem DOM), sowie ein kurzer Zug
  unter der Schwelle (Zurückschnappen, Toast bleibt bestehen).
- **Tab-Bar auf iPhones von der Ecken-Rundung angeschnitten (behoben in v1.9.71):** Nutzerfeedback:
  die App füllt den Bildschirm komplett aus - auf Android kein Problem (dort folgt unter der App
  noch die eigene System-Navigationsleiste, per Nutzer bestätigt z.B. auf einem Pixel 7 Pro), auf
  iPhones ohne Home-Taste liegt der äußerste Rand der `.tabbar` aber exakt dort, wo die abgerundeten
  Bildschirmecken ein Icon optisch anschneiden (u.a. das Einstellungen-Icon ganz rechts, da es das
  äußerste ist). **Wichtige Erkenntnis, die die bestehende v1.8.24/v1.8.25-Doku ergänzt:** jene
  beiden Einträge lösten ein VERTIKALES Problem (Lücke zwischen Tab-Bar und unterem Bildschirmrand
  durch Safaris unzuverlässige dvh/vh-Berechnung, behoben durch Entfernen von `viewport-fit=cover` +
  `position:fixed; inset:0` statt `height:100dvh`) - das Ecken-Rundungs-Problem ist ein GETRENNTES,
  HORIZONTALES Problem: `env(safe-area-inset-left/right)` ist im Hochformat auf so gut wie allen
  iPhones 0 (unabhängig von `viewport-fit`), die Ecken-Rundung wird also nie als "unsicherer
  Bereich" gemeldet - ein größerer vertikaler Sicherheitsabstand (Safe-Area-Bottom) hätte das
  horizontale Eckenproblem deshalb gar nicht adressiert, es brauchte einen eigenen, seitlichen Fix.
  Nutzerfrage dabei: soll das dynamisch nur die betroffenen Geräte treffen, statt pauschal überall
  Platz wegzunehmen (der auf Android schlicht nicht nötig ist)? Lösung ohne JavaScript/User-Agent-
  Sniffing: `@supports (-webkit-touch-callout: none)` - diese CSS-Eigenschaft wird ausschließlich von
  WebKit auf iOS erkannt (Safari und, weil Apple allen iOS-Browsern denselben WebKit-Unterbau
  vorschreibt, auch Chrome/Firefox auf iOS) und existiert auf Android in keiner Form. Nur innerhalb
  dieses `@supports`-Blocks bekommt `.tabbar` 16px statt der sonst üblichen 6px horizontalen
  Innenabstand - reine CSS-Feature-Erkennung, kein Geräte-/Browser-String-Vergleich, automatisch
  zukunftssicher für jedes kommende iPhone-Modell. Per Playwright verifiziert, dass
  `CSS.supports('-webkit-touch-callout','none')` in Chromium (verhält sich wie Android) korrekt
  `false` liefert und die Tab-Bar bei den ursprünglichen 6px bleibt - der iOS-Zweig selbst ließ sich
  in der Sandbox nicht gegenprüfen (kein echtes WebKit-iOS verfügbar, derselbe bekannte Sonderfall
  wie schon bei früheren `viewport-fit`/`env(safe-area-inset-*)`-Fixes).
- **Rückgängig-Hinweis überlappte FAB-Buttons (behoben in v1.9.72):** Nutzerfund direkt im Anschluss
  an die Allrichtungs-Wisch-Erweiterung (s.o.): der Hinweis saß fest bei `bottom:160px` (CSS) - ein
  Wert, der ursprünglich genau über der "+"/Lupen-FAB-Reihe (`bottom:88px`) lag, aber nie nachgezogen
  wurde, als später `map-fab` (Regionskarte, `bottom:210px`) und `stash-fab` (Zurückgestellt-
  Übersicht, `bottom:154px`) als zusätzliche, höher gestapelte FAB-Reihen dazukamen (siehe
  Regions-Karte/Später-fangbar-Übersicht-Einträge oben). Klassisches "Konstante wurde bei einer
  späteren Erweiterung nicht nachgezogen"-Muster, wie schon beim Service-Worker-`CACHE_NAME` und dem
  fehlenden `id`-Feld bei Boss-Kacheln - der Hinweis überlappte je nach Edition/Zustand (z.B. beim
  Fangen auf einer Edition mit Regionskarte) mit der mittleren oder oberen FAB-Reihe. Statt erneut
  einen (beim nächsten neuen FAB wieder veraltenden) festen Wert zu raten: `undoToastBottomPx()`
  misst bei JEDEM Anzeigen live per `getBoundingClientRect()` nach, welche der fünf FAB-Elemente
  (`fabAdd`/`searchFab`/`mapFab`/`stashFab` per `offsetParent!==null`-Sichtbarkeitscheck, da sie über
  `style.display` ein-/ausgeblendet werden; `jumpFab` separat über seine `.visible`-Klasse, da es
  stattdessen mit Opacity/Pointer-events arbeitet und `offsetParent` deshalb nicht zuverlässig wäre)
  sowie die Tab-Bar selbst (immer als Referenz, damit auch FAB-lose Tabs wie Team/Box eine sinnvolle
  Mindesthöhe bekommen) gerade sichtbar sind, und setzt `toast.style.bottom` per Inline-Style knapp
  über dem höchsten davon (14px Abstand). `getBoundingClientRect()` liefert Viewport-Koordinaten und
  hat bereits gerenderte `env(safe-area-inset-bottom)`-Anteile der Referenzelemente eingerechnet -
  keine separate Safe-Area-Rechnung in der neuen Funktion nötig. Per Playwright in beiden Extremen
  verifiziert (Rot/Blau mit erzwungenermaßen allen FABs sichtbar vs. Team-Tab ganz ohne FABs) - in
  keinem der beiden Fälle Überlappung mit einem FAB oder der Tab-Bar. **Lehre:** ein UI-Element, das
  sich an anderen, potenziell wachsenden UI-Stapeln orientieren muss (hier: FAB-Reihen), sollte seine
  Position nach Möglichkeit aus deren tatsächlichem, gerade sichtbarem Zustand ableiten statt aus
  einer zum Zeitpunkt der Implementierung passenden, aber stillschweigend alternden Konstante.

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
- **Kanto — Safari-Zone fehlte als eigene Kachel (behoben in v1.9.73):** Nutzerfund "in Kanto scheint
  die Safari-Zone zu fehlen." Bestätigt: in allen fünf Kanto-Editionen (Rot/Blau/Gelb/FeuerRot/
  BlattGrün) war sie nur als Notiz-Text bei Fuchsania City vermerkt, keine eigene trackbare Kachel -
  obwohl sie im echten Spiel eine eigene, betretbare Fläche mit eigener Fangliste ist (Kangama,
  Chaneira, versionsexklusiv Sichlor/Pinsir - alle sonst nirgends im Spiel fangbar). Als eigene
  Kachel direkt nach Fuchsania City ergänzt (Zugang im Spiel über ein Tor dort). Da
  `KANTO_FRLG_LOCATIONS` per `...KANTO_RB_LOCATIONS`-Spread denselben Datensatz wie Rot/Blau
  wiederverwendet (siehe Datenmodell-Abschnitt oben), war die Korrektur in `KANTO_RB_LOCATIONS`
  automatisch auch für FeuerRot/BlattGrün erledigt - nur `KANTO_YELLOW_LOCATIONS` (eigener,
  vollständig separater Datensatz) musste zusätzlich einzeln angepasst werden. **Genau dieselbe
  Bugklasse wie bei der Urzeithöhle** (Existenzlücke, keine Reihenfolgefrage - die abgeschlossene
  Reihenfolge-Verifikation für Kanto in `order-gen1-3.md` hatte sie folgerichtig nicht gefunden, s.
  dortiger Eintrag zur Unterscheidung Reihenfolge- vs. Existenzprüfung). **Für künftige Audits:**
  gezielt nach weiteren "nur im Notizfeld einer Stadt erwähnter Sonderort mit eigener Fangliste"-
  Fällen suchen (Präzedenzfall bereits vorhanden: Pokémon-Turm/Kraftwerk/Pokémon-Villa bekommen in
  derselben Kanto-Liste längst eigene Kacheln, Safari-Zone war die Ausnahme) - Silph Co./S.S. Anne/
  Rocket-Versteck bleiben dagegen bewusst reine Notizen, da sie keine eigenen wilden Pokémon haben.
  Der neue Kartenpunkt in `REGION_MAPS["rot-blau"]` war zunächst nur ein ungefährer Platzhalter neben
  Fuchsania City - **in v1.9.74 vom Nutzer selbst über den Kalibrierungsmodus** auf die tatsächliche
  Position `[34.6, 70.9]` korrigiert, alle anderen Kanto-Punkte blieben dabei unverändert.
- **Hoenn — Urzeithöhle fehlte komplett (behoben in v1.9.65):** Nutzerfrage "kann es sein dass in
  allen Hoenn-Regionen die Urzeithöhle fehlt? Außerdem in ORAS die Geheiminsel." Bestätigt: die
  Urzeithöhle (Cave of Origin, bei Xeneroville/Sootopolis City) fehlte in Rubin/Saphir/Smaragd/ORAS
  komplett, obwohl sie in Rubin/Saphir/ORAS der Story-Pflicht-Fangort für Groudon/Kyogre (bzw. deren
  Primal-Formen) ist - kein optionaler Postgame-Bonus. Jetzt ergänzt, mit editionsspezifischem
  Standort-Hinweis (Rubin/Saphir/ORAS: Fangort; Smaragd: nur einmaliger Nicht-Fang-Besuch, Wallace
  debattiert über Rayquaza, danach versperrt) sowie umgehängter `bossAfter`-Bindung für Juan/Wassili
  (vorher an Xeneroville selbst, jetzt an die neue Urzeithöhle-Kachel - der Arenakampf folgt im
  echten Spiel erst NACH dem Höhlenbesuch). „Geheiminsel" (Secret Islet) dagegen bestätigt **kein**
  Fehler - nur einer von mehreren ORAS-Geheimbasis-Spots ohne Pokémon/Trainer/Items, für einen
  Nuzlocke-Tracker irrelevant, korrekt ausgelassen. Der neue Kartenpunkt in `REGION_MAPS.smaragd`
  (gilt per Objektreferenz auch für rubin/saphir/omegarubin/alphasaphir) war zunächst nur ein
  ungefährer Platzhalter nahe Xeneroville - **in v1.9.67 vom Nutzer selbst über den
  Kalibrierungsmodus** auf die tatsächliche Position `[72, 54.8]` korrigiert, alle anderen 77
  Hoenn-Punkte blieben dabei unverändert. **Wichtige Lehre:** die bereits abgeschlossene
  Reihenfolge-Verifikation (`order-gen1-3.md`, s. u.) hatte diese Lücke NICHT gefunden, weil sie nur
  die relative Reihenfolge bereits VORHANDENER Standorte gegen Bulbapedias „Connecting areas" prüft,
  keine Existenzlücken (komplett fehlende Standorte) aufdeckt - das ist eine andere Prüfungsart und
  müsste bei künftigen Audits (Alola/Galar, Sinnoh/Einall-Nachrecherche) explizit mitgedacht werden,
  nicht als durch die Reihenfolge-Verifikation bereits abgedeckt angenommen werden.
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
