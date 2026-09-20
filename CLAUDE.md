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
  **Komplette Neu-Kalibrierung aller 50 Kanto-Punkte (v1.9.88) - dieselbe Route-22-Falle ein drittes
  Mal aufgetreten, dieselbe Gegenmaßnahme:** Nutzer hat den kompletten Kalibrierungsmodus erneut
  durchlaufen und eine komplett neue Koordinatenliste eingereicht (alle 50 Standorte). Vor dem
  Übernehmen per Shapely-Geometrieprüfung nachgerechnet (`shapely.geometry.Polygon(...).intersection(...)`)
  - exakt derselbe Fall wie in v1.9.77: die neu eingereichte "Route 22 (Rückweg)"-Fläche überlappte
  zu ~78% mit der neuen "Route 22"-Fläche, hätte "Route 22" also wieder größtenteils untappbar
  gemacht. 49 der 50 eingereichten Werte 1:1 übernommen, für "Route 22 (Rückweg)" wieder bei der
  v1.9.77-Ausnahme geblieben (einzelner Punkt statt Fläche, Koordinate = arithmetischer Mittelpunkt
  der vier eingereichten Ecken - fiel praktisch exakt mit dem alten v1.9.77-Punkt zusammen). **Lehre,
  die die v1.9.77-Lehre bestätigt statt sie zu ersetzen:** der Kalibrierungsmodus selbst kennt die
  Route-22-Ausnahme NICHT (`isRouteCalibrationName()` bietet "Route 22 (Rückweg)" bei jedem Durchlauf
  wieder ganz normal eine Fläche an, da es rein ein `"Route "`-Präfix-Check ist) - bei jeder künftigen
  Neukalibrierung (Kanto erneut, oder erstmals Hoenn/andere Editionen mit Flächen-Format) MUSS die
  eingereichte Rohdaten-Liste vor dem Commit auf genau solche Überlappungen geprüft werden, sich
  NICHT darauf verlassen, dass eine frühere Handkorrektur "sich schon gemerkt" hätte - sie tut es
  nicht, jede neue Kalibrierungsrunde reproduziert die Falle unverändert, wenn nicht erneut geprüft
  wird. Praktisches Vorgehen, das sich hier bewährt hat: bei Verdacht auf zwei sich physisch
  überschneidende Standorte (identischer/ähnlicher Name, "(Rückweg)"/"(Postgame)"-Suffix o.Ä.) die
  eingereichten Ecken-Koordinaten mit `pip install shapely` + `Polygon(...).intersection(...).area`
  gegenrechnen, statt nur visuell/nach Gefühl zu urteilen - eine 78%-Überlappung ist mit bloßem Auge
  an reinen Zahlenlisten nicht zuverlässig erkennbar. Verifiziert per Playwright: weiterhin 50
  Standorte (25 Flächen, 25 Punkte); ein Tap direkt auf den Rückweg-Punkt trifft "Route 22
  (Rückweg)"; ein Tap in einer vom Punkt entfernten Ecke von "Route 22"s neuer Fläche trifft korrekt
  "Route 22".
  **Sauberere Routenflächen, dritte Farbe für den aktuellen Standort, Farb-Legende (v1.9.89):**
  direktes Nutzerfeedback im Anschluss an die v1.9.88-Neukalibrierung: "das grün der routen ist noch
  immer etwas zu dezent... beides wirkt optisch noch etwas 'billig' wie können wir es erreichen dass
  es sauber und clean aussieht" + "der aktuelle standort ist noch etwas zu dezent evtl. sollte hier
  sind wir in einer anderen farbe dargestellt werden?" Drei Änderungen an `.map-quad`/`.map-pin`:
  1. **Tiefe statt Flachfarbe:** `.map-quad` hatte bislang einen einzelnen flachen `rgba(...)`-Ton
     direkt auf `clip-path` - wirkt wie ein hart ausgeschnittener Farbfleck ohne Tiefe ("billig
     hingeklatscht"). Jetzt ein diagonaler `linear-gradient` (heller oben-links, kräftiger
     unten-rechts) statt eines flachen Tons, plus `filter:drop-shadow(...)` statt `box-shadow` für
     den Rand-Schatten. **Wichtiger technischer Grund für `filter` statt `box-shadow`:** `box-shadow`
     (wie `border`) orientiert sich am rechteckigen Element-Body, nicht am sichtbaren, von
     `clip-path` beschnittenen Vieleck - ein `box-shadow` würde also am Rand der UNSICHTBAREN
     Bounding-Box ansetzen, nicht an der tatsächlichen Polygonform. `filter` wird dagegen laut
     CSS-Spezifikation NACH dem `clip-path` auf das bereits beschnittene Ergebnis angewendet und
     folgt damit exakt der sichtbaren Silhouette - ergibt einen echten, an der Form anliegenden
     Schlagschatten. Grün (`.map-quad.done`) zusätzlich von .5/.85 (vorher .62 flach) angehoben.
  2. **Aktueller Standort in eigener dritter Farbe:** bislang nutzten `.map-pin.current`/
     `.map-quad.current` denselben Gold-/Editions-Akzentton wie "offen" (`--gold`/`--gold-glow`), nur
     mit höherer Deckkraft - auf derselben Karte kaum vom "offen"-Zustand zu unterscheiden. Jetzt
     `--evolve`/`--evolve-glow` (dieselbe Blau-Familie, die im übrigen Code schon als generischer
     "hier hinschauen"-Akzent dient, z. B. `.search-highlight`, `evolveFlash`) - drei jetzt klar
     unterscheidbare Farben: Gold/Editionsfarbe = offen, Grün = erledigt, Blau = aktueller Standort.
     `.map-pin.current` bekam zusätzlich einen weichen Leuchtring (`box-shadow` mit `--evolve-glow`,
     da Punkte anders als Flächen keinen `clip-path` haben und `box-shadow` dort problemlos
     funktioniert) und wuchs leicht (19px→20px). Beide `.current`-Marker pulsieren jetzt zusätzlich
     dezent (`@keyframes mapCurrentPulse`, Opacity 1↔.72, 2,4s, in
     `@media (prefers-reduced-motion: no-preference)` gekapselt wie alle anderen Animationen dieser
     Codebase) - bewusst langsam/leise gehalten, damit es auffällt, ohne unruhig oder erneut "billig"
     zu wirken.
  3. **Farb-Legende:** neue kompakte `<div class="map-legend">` mit drei Punkt+Label-Paaren
     (`regionMapSheetHtml()`, direkt über der Kartengrafik) - NUR im Kartengrafik-Modus, nicht im
     Schema-Modus, da die Schema-Ansicht ihre Zustände bereits über Text + eigene `.schema-dot`-
     Klassen selbsterklärend zeigt und die Legende dort nur zusätzlicher Lärm wäre.
  **Wichtige Randnotiz, per Playwright-Test entdeckt (kein Bug, aber zunächst überraschend):** die
  Farbwerte, die `getComputedStyle()` für `--gold-glow` in Rot/Blau zurückgibt, sind KEIN Gold-Ton,
  sondern ein Rot-Ton (z. B. `224,57,60`) - das ist beabsichtigtes bestehendes Verhalten von
  `injectEditionThemeCSS()`, das `--gold`/`--gold-glow` pro Edition auf deren eigene Akzentfarbe
  umbiegt (der Name "gold" ist rein historisch/generisch, keine feste Farbaussage) - die neuen
  Verlauf-/Schatten-Regeln erben dieses Verhalten automatisch korrekt mit, da sie dieselben
  CSS-Variablen verwenden wie zuvor, keine Anpassung nötig. Verifiziert per Playwright (inkl.
  Screenshot-Kontrolle): Verlauf und Schlagschatten korrekt berechnet und editionsspezifisch
  eingefärbt; der aktuelle Standort zeigt nachweislich `--evolve` als Hintergrund-/Randfarbe plus
  laufende `mapCurrentPulse`-Animation; die Legende erscheint nur im Kartengrafik-Modus, verschwindet
  im Schema-Modus.
  **Standort-Punkte mit Glanz-Optik statt Flachfarbe (v1.9.90):** direktes Anschlussfeedback zur
  v1.9.89-Auslieferung: "die punkte wirken aber auch noch nicht wirklich hochwertig die wirken einfach
  wie billige farbkleckse" - dasselbe Grundproblem wie bei den Routenflächen zuvor, nur bei
  `.map-pin` statt `.map-quad`: eine einzelne flache Füllfarbe (`var(--surface)`/`var(--good)`/
  `var(--evolve)`) auf einem Kreis sieht wie ein simpler eingefärbter Punkt aus. **Lösung, bewusst
  OHNE pro Zustand einzeln abgestimmte Verlaufsfarben:** zwei rein weiße/schwarze radiale Verläufe
  ÜBER der jeweiligen Grundfarbe gelegt (`radial-gradient(circle at 32% 26%, rgba(255,255,255,.X) 0%,
  rgba(255,255,255,0) 52%)` für ein Glanzlicht oben-links, `radial-gradient(circle at 68% 80%,
  rgba(0,0,0,.X) 0%, rgba(0,0,0,0) 62%)` für einen Schatten unten-rechts, darunter die eigentliche
  `var(...)`-Grundfarbe als dritte, unterste `background`-Ebene) - ergibt eine Perlen-/Kugel-Optik,
  die automatisch mit JEDER Grundfarbe funktioniert (Weiß/Grün/Blau) und in beiden Farbschemata,
  ohne dass für jede Kombination aus Zustand × Farbschema eigene Lichtwerte gepflegt werden müssten.
  **Exakt dasselbe bereits etablierte Muster wie `.type-coverage-icon::after`** (die Regenbogen-
  Energie-Kugel im Team-Tab, siehe Datenmodell-Abschnitt oben) - dort mit fest codierten Hex-Werten,
  weil die Grundfarbe dort immer gleich ist; hier bewusst mit reinen Weiß-/Schwarz-Ebenen, weil die
  Grundfarbe je nach Zustand (offen/erledigt/aktuell) wechselt und ein fest codierter Glanzlicht-Ton
  nur zu EINER der drei Grundfarben gepasst hätte. Reine `background`/`border-color`-Änderung an
  `.map-pin`/`.map-pin.done`/`.map-pin.current` - Größe, Klickbereich, Kalibrierungslogik und die
  v1.9.89-Erweiterungen (Leuchtring, Pulsieren beim aktuellen Standort) alle unverändert. Per
  Playwright-Screenshot-Vergleich gegengeprüft (kleine Kartenvorschau UND Vollbild-Vergrößerung) -
  sichtbar reifere "Kugel mit Glanzpunkt"-Optik statt der vorherigen flachen Punkte.
  **Hoenn-Routen weiterhin nicht auf das Flächen-Format umkalibriert** - bewusst zurückgestellt, bis
  der Nutzer Zeit für die entsprechende Kalibrierungsrunde hat (analog zum ursprünglichen
  Kanto-Aufwand).
  **Beliebig viele Ecken statt fest 4, kleinere Ecken-Marker, kräftigere Farben (seit v1.9.79):**
  Nutzerfeedback direkt nach der ersten kompletten Kanto-Routen-Kalibrierung: "nebst kurven routen
  gibt es auch welche mit wckigen Kurven besser wäre wenn ich beliebig viele ecken anwählen kann und
  dann bestätige" + "wenn ich eine ecke angewählt habe ist der punkt dafür viel zu gross" + "die
  farben sind mir zu dezent nimm kräftigere farben". Drei getrennte Anpassungen an derselben Stelle:
  1) **Ecken-Obergrenze entfernt** - der `calibration-tap`-Handler committete bisher automatisch beim
  vierten Tap (`if(calibrationQuadBuffer.length>=4){...}`), das reichte für Routen mit mehreren
  Richtungswechseln (nicht nur ein einfaches Viereck) nicht aus. Jetzt sammelt `calibrationQuadBuffer`
  beliebig viele Ecken ohne Auto-Abschluss, ein neuer Button "Fertig (`data-act=
  "calibration-confirm-corners"`)" committet erst auf expliziten Tap - `disabled`, solange weniger als
  3 Ecken gesetzt sind (ein Polygon braucht mindestens ein Dreieck). Wichtig: das Datenformat selbst
  (`{quad:[[x,y],...]}`, `clip-path: polygon(...)`) kannte diese 4er-Grenze nie - sie war reine
  UI-Beschränkung des Kalibrierungsmodus, keine Datenmodell-Grenze. `mapCalibrationHtml()`s
  Fortschrittstext dadurch von "Ecke X von 4" auf "Ecke X" (ohne Gesamtzahl) vereinfacht, "Ecke
  zurück" (`calibration-back`) unverändert - nimmt weiterhin nur die zuletzt gesetzte Ecke aus dem
  Buffer, keine Änderung an dieser Logik nötig. 2) **`.map-corner-dot` von 18px auf 11px verkleinert**
  (Font von .62rem auf .5rem) - auf der nur ~300-350px breiten Kalibrierungs-Kartenvorschau wirkte der
  ursprüngliche Marker deutlich überdimensioniert und verdeckte bei eng beieinanderliegenden Ecken
  (genau der Fall bei winkligen Routen) die darunterliegenden Kartendetails, die man zum präzisen
  Antippen der nächsten Ecke braucht. 3) **`.map-quad`-Deckkraft kräftig angehoben**: offen (nicht
  erledigt) 32%→55%, erledigt 40%→62%, aktueller Standort 60%→78% - vorher auf der Kartengrafik
  gegenüber deren eigenem, ähnlich getöntem Pink/Tan-Wegbelag kaum wahrnehmbar (per Vorher/Nachher-
  Screenshot-Vergleich bereits bei der ursprünglichen v1.9.77-Auslieferung selbst aufgefallen, aber
  damals nicht als eigener Punkt behoben, da nicht explizit bemängelt - jetzt nachgeholt). Verifiziert
  per Playwright: 7 nacheinander simulierte Ecken-Taps landeten vollständig im Buffer (kein Abbruch
  bei 4), der "Fertig"-Button blieb bis zur dritten Ecke `disabled` und committete danach das
  komplette 7-Ecken-Polygon unverändert (keine Kappung auf 4) in `calibrationPoints`.
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
- **Todesursache-Tracking, zwei getrennte Wege (Bosskampf-Verlinkung seit v1.9.80):** Nutzerfrage
  "hatten wir da nicht mal eine Funktion, dass beim Sterben abgefragt wird, gegen wen es verloren
  hat?" - stimmte, aber nur für den EINEN der zwei Fälle. Es gibt zwei komplett unabhängige
  Hausregel-Schalter, die leicht verwechselt werden:
  1. **"Todesursache eintragen"** (`state.trackDeathCause`, unter „Regeln", seit v1.8.48/1.9.x
     ausgebaut) - fragt beim "Als gestorben markieren" AUSSERHALB von Bosskämpfen
     (`openDeathCauseSheet()`) per Freitext+Spezies-Autovervollständigung ab, gegen was es passiert
     ist (z.B. ein wildes Pokémon beim Grinden, wo es keinen vorab bekannten Gegner gibt).
  2. **"Gegner-Team tracken"** (`state.trackBossTeams`, unter „Duell &amp; Bosse") - lässt pro Boss
     das tatsächliche gegnerische Team (bis zu 6 Pokémon, `state.bossOpponentTeams[bossId]`)
     eintragen. Bis v1.9.79 diente das NUR der Anzeige/Referenz auf der Bosskarte - beim Eintragen
     einer Niederlage (`openBossResultSheet()`) gab es weiterhin nur eine reine Checkliste "welche
     Team-Pokémon sind gestorben", ohne jede Verlinkung zum bereits bekannten Gegner-Team. Genau
     diese fehlende Verlinkung war der Nutzerfund.
  **Fix (v1.9.80):** `openBossResultSheet()` zeigt jetzt, wenn `trackBossTeams` an ist UND für
  genau diesen Boss ein Team eingetragen wurde, unter jeder angehakten Todeszeile eine Reihe
  antippbarer Chips mit den Namen aus `bossOpponentTeams[bossId]` (`.death-vs-chip`,
  `data-act="toggle-death-vs"`, Einzelauswahl pro Zeile - nochmaliges Antippen hebt sie wieder auf).
  Auswahl landet in einer rein lokalen, nicht persistierten Zwischenvariable `bossLossDeathVs`
  (keyed nach `loc.id`), wird erst bei `confirm-boss-result` in `loc.mon.deathCause` übernommen -
  **dasselbe Feld**, das auch der Freitext-Weg (1.) nutzt, dadurch identische Anzeige im Friedhof
  ("Gestorben gegen: …") ohne zusätzlichen Code. Bewusst **unabhängig von `trackDeathCause`**
  nutzbar (kein zweiter Schalter nötig, wer schon ein Gegner-Team pflegt, soll die Verlinkung direkt
  bekommen) - beide Schalter bleiben aber weiterhin unabhängig voneinander umschaltbar, keiner setzt
  den anderen voraus. Die Chip-Zeile blendet sich live mit dem zugehörigen Kontrollkästchen ein/aus
  (neuer Eintrag im zentralen `input`-Event-Delegierer für `[data-death-loc]`,
  `.death-vs-row.hidden` per `classList.toggle`) - kein Grund, nach einer Auswahl zu fragen, wenn
  das Pokémon gar nicht als gestorben markiert ist. Bewusst KEIN natives `<select>` verwendet (kommt
  im gesamten Code sonst nirgends vor, überall stattdessen Buttons/Chips) - stattdessen dieselbe
  Chip-Optik wie die bestehenden `.chip.gold`/`.chip.accent`-Badges, nur klickbar gemacht. Ohne
  eingetragenes Gegner-Team für den jeweiligen Boss (oder bei deaktiviertem `trackBossTeams`) bleibt
  die Checkliste unverändert wie vor v1.9.80 - reine additive Erweiterung, kein bestehender Ablauf
  musste angepasst werden. Verifiziert per Playwright: Checkbox-Toggle blendet die richtige
  Chip-Gruppe ein/aus, Chip-Auswahl landet nach Bestätigen korrekt als `deathCause` am richtigen
  Pokémon, Anzeige im Friedhof stimmt.
- **Einstellungs-Kapitel sahen wie reiner Text aus, nicht wie Buttons (behoben in v1.9.81):**
  Nutzerfeedback: "in den einstellungen sind die kapitel noch links zum ein/ausklappen und nicht für
  touchscreenoptimiert bzw. ersichtlich." `settingsGroupHtml()`s Gruppenköpfe
  (`.settings-group-header`, Klasse `region-header settings-group-header`) waren zwar die gesamte
  Zeile über als `<button data-act="toggle-settings-group">` anklickbar, erbten aber von
  `.region-header` eine winzige 0.72rem-Versalienschrift ohne Rand/Hintergrund/Radius - sah wie ein
  reiner Abschnittstitel aus, nicht wie ein Button, dazu nur 38px Zeilenhöhe (unter dem gängigen
  44px-Mindestwert für Touch-Ziele). **Exakt dasselbe Problem wie beim Routen-Tab-Toggle
  `.collapse-toggle`** ("X erledigte Standorte") vor dessen eigener, bereits dokumentierter Korrektur
  ("Vorher reiner Text+Icon ohne Kontur/Hintergrund - auf Touchscreens nicht als eigenständig
  tappbares Element erkennbar") - dort bereits gelöst, hier bewusst dieselbe bewährte Lösung
  übernommen statt eine neue zu erfinden: Rand (`var(--line)`), Hintergrund (`var(--surface-alt)`),
  `var(--radius)`, `var(--shadow)`, größere Schrift ohne Versalien, mehr Innenabstand (14px 16px) -
  Zeilenhöhe dadurch auf 46px gewachsen (vorher/nachher per Playwright `getBoundingClientRect()`
  gemessen: 38px → 46px). Rein additive CSS-Änderung an `.settings-group-header` - Klapp-Logik,
  Chevron-Rotation und `.collapsible-body`-Animation unverändert, da die Zeile schon vorher
  strukturell korrekt als Button existierte, nur optisch nicht als solcher erkennbar war. Betrifft
  automatisch auch den strukturgleichen Spielstände-Archiv-Toggle (`archiveToggle` in
  `renderSettings()`, nutzt dieselben zwei Klassen) - keine gesonderte Anpassung dort nötig.
- **Bosskampf-Tode jetzt mit dem konkreten Bosskampf verknüpft, nicht nur mit der Gegner-Spezies
  (seit v1.9.82):** Direkte Rückfrage zur v1.9.80-Chip-Auswahl: lässt sich daraus auch
  rekonstruieren, welches TEAM (welcher Bosskampf) einen besiegt hat, nicht nur die einzelne Spezies?
  Antwort zum Zeitpunkt der Frage: nein - `loc.mon.deathCause` speicherte nur den gewählten
  Gegner-Namen als reinen Text (identisch zum Freitext-Weg, siehe Todesursache-Tracking-Eintrag oben),
  ohne Bezug zum jeweiligen Bosskampf. Fix: neues, rein additives Zusatzfeld
  `loc.mon.deathBossId`, gesetzt in `confirm-boss-result` GENAU dann, wenn ein Tod über die
  Chip-Auswahl aus einem getrackten Gegner-Team einem Bosskampf zugeordnet wird
  (`if(vs){ loc.mon.deathCause = vs; loc.mon.deathBossId = id; }`) - bei der separaten
  Freitext-Todesursache außerhalb von Bosskämpfen (`openDeathCauseSheet`/`performMarkDead`) bleibt es
  bewusst ungesetzt (dort `delete m.deathBossId` zur Sicherheit, falls ein zuvor boss-verknüpft
  gestorbenes und wiederbelebtes Pokémon später außerhalb eines Bosskampfs erneut stirbt). `revive`
  löscht symmetrisch beide Felder (`delete m.deathCause; delete m.deathBossId;`). `renderGrave()`
  löst `deathBossId` bei Vorhandensein gegen `bossById()` auf (inkl. Rivalen-Spitzname-Logik wie in
  `openBossResultSheet()`) und hängt den Bossnamen in Klammern an: "Gestorben gegen: Habitak (Team
  von Blau)" statt nur "Gestorben gegen: Habitak". Bewusst KEIN Umbau von `deathCause` selbst (z. B.
  zu einem Objekt `{species, bossId}`) - das hätte alte Spielstände (Freitext-Strings von vor
  v1.9.80, oder schon boss-verlinkte Strings aus v1.9.80/81 ohne `deathBossId`) migrieren müssen;
  ein separates optionales Feld daneben ist rückwärtskompatibel ohne jede Migration. Per Playwright
  verifiziert: Boss-Verlust mit Chip-Auswahl setzt beide Felder korrekt und zeigt den Bossnamen im
  Friedhof; der Freitext-Weg setzt nachweislich `deathBossId` nicht; `revive` entfernt beide Felder
  wieder vollständig (`'deathBossId' in mon` danach `false`).
  **Backlog, bewusst zurückgestellt** (Nutzerwunsch: "der rest der ideen kommt mal ins backlog"),
  jetzt technisch möglich dank `deathBossId`:
  - **Nemesis-Pokémon-Statistik**: welche Gegner-Spezies hat insgesamt die meisten eigenen Team-
    Mitglieder getötet - reine Auszählung von `deathCause` über alle toten Team-Pokémon, technisch
    schon OHNE `deathBossId` möglich (nur `deathCause`-Text zählen), aber mit `deathBossId` zusätzlich
    nach Bosskampf aufschlüsselbar ("gegen X Bosse eingesetzt, hat trotzdem Y Team-Mitglieder
    gekostet").
  - **"Gefährlichster Trainer"** ist in `runRecapInsights()` (Run-Rückblick) über `state.bossLossIds`
    (Anzahl Niederlagen pro Boss, unabhängig von `deathCause`/`deathBossId`) bereits als "Härtester
    Gegner: {Boss} ({N}× verloren)" vorhanden - NICHT neu zu bauen, nur ggf. um eine
    Detailaufschlüsselung ("hat X mit {Spezies A}, Y mit {Spezies B} besiegt") zu erweitern, jetzt
    dank `deathBossId` möglich (vorher nicht, da kein Tod einem Bosskampf zuordenbar war).
  - **Achievement** für besonders viele Team-Verluste gegen dieselbe Gegner-Spezies oder denselben
    Bosskampf (z. B. "Erzfeind" - X eigene Pokémon gegen dieselbe Spezies verloren) - neuer Eintrag im
    `ACHIEVEMENTS`-Array, Check-Funktion analog zu bestehenden `bossLossIds`-basierten Erfolgen (siehe
    `checkAchievements()`).
  - **Ausführlichere Recap-Erzählung** (`runRecapNarrative()`/`runRecapInsights()`): einen Insight wie
    "Dein größter Feind war {Species}, hat {N} deiner Pokémon besiegt" ergänzen, analog zum
    bestehenden "Härtester Gegner"-Insight, aber pokémon- statt bosszentriert.
- **Soul-Link-Modus war unauffindbar, wenn man ihn nicht schon kannte (erster Fix v1.9.83, per
  Nutzerkorrektur weiterentwickelt in v1.9.84 - siehe dort unten im selben Punkt):**
  Nutzerfrage "hatten wir nicht noch eine Soul-Link-Funktion integriert? oder war das einfach eine
  Idee?" - die Funktion existierte bereits vollständig (`state.soulLinkMode`, `soulLinkMismatches()`,
  `checkSoulLinkAfterDeath()`, `openSoulLinkHintSheet()`, siehe Datenmodell-Abschnitt oben), war aber
  in der UI komplett verborgen: der Schalter (`data-act="toggle-soul-link"`) steckt in
  `duoCompareCardHtml()` und wird nur im ZWEITEN Zweig dieser Funktion gerendert - also erst, NACHDEM
  `state.duoCode` bereits gesetzt ist (ein Duo-Vergleichspartner verknüpft wurde). Im ersten Zweig
  (noch kein Partner verknüpft, der Normalfall beim ersten Entdecken der Einstellungen) gibt es
  überhaupt keinen Hinweis, dass ein Soul-Link-Modus existiert - dieselbe Karte zeigt dort nur das
  Duo-Vergleich-Eingabefeld. Nutzer-Nachfrage bestätigte das Problem treffend: "wenn man den Modus
  nicht kennt kann man nicht wissen, dass ein solcher möglich ist" - eine rein bedingt gerenderte
  Funktion ohne jeden Vorab-Hinweis ist von der Discoverability her nicht von einer nicht
  existierenden Funktion zu unterscheiden. **Fix, bewusst NICHT den Schalter selbst vorzeitig
  anzeigen** (er bräuchte ohnehin einen verknüpften Partner-Spielstand zum Koppeln, ein Klick vorher
  liefe ins Leere) - stattdessen an zwei Stellen einen Vorab-Hinweis ergänzt: 1) der `loc-sub`-Text
  der noch-nicht-verknüpften Duo-Vergleich-Karte selbst bekam den Satz "Danach lässt sich hier
  zusätzlich der Soul-Link-Modus aktivieren, der eure Encounter 1:1 pro Standort koppelt." angehängt
  - sichtbar auch ohne das Info-Icon anzutippen. 2) `SETTINGS_HELP.duocompare` (der ausführliche
  Hilfetext hinter dem Info-Icon, ebenfalls schon vor dem Verknüpfen sichtbar) erwähnt jetzt
  zusätzlich, dass nach dem Verknüpfen ein Soul-Link-Schalter erscheint, mit Verweis auf den eigenen
  `SETTINGS_HELP.soullink`-Eintrag. **Lehre, verallgemeinerbar:** eine Funktion, die erst nach einer
  Voraussetzung (hier: Partner-Verknüpfung) überhaupt im DOM erscheint, braucht einen Vorab-Hinweis
  IN DEM ZUSTAND DAVOR, sonst ist sie faktisch unauffindbar, egal wie gut sie dokumentiert ist, sobald
  man sie einmal erreicht hat - bei künftigen Feature-Additionen, die an eine Bedingung geknüpft sind
  (ähnlich wie hier `state.duoCode`, oder z. B. `state.trackBossTeams` bei der Gegner-Team-Chip-
  Auswahl aus v1.9.80, die ihrerseits schon einen sichtbaren Schalter unter „Duell & Bosse" hat und
  dieses Problem deshalb nicht hat), aktiv prüfen, ob der Zustand DAVOR ebenfalls einen Hinweis
  bekommt.
  **Nutzerkorrektur, weiterentwickelt in v1.9.84 - der obige "bewusst NICHT den Schalter selbst
  vorzeitig anzeigen"-Ansatz wurde direkt im Anschluss verworfen:** "ich denke besser ist den Button
  schon zu haben und wenn noch kein Partner-Spielstand eingetragen ist und der Button betätigt wird,
  genau die Info bitte, zuerst Partnerspielstand einzutragen, um den Soul-Link-Modus zu starten." Der
  reine Text-Hinweis aus v1.9.83 war zwar eine Verbesserung gegenüber komplettem Schweigen, aber der
  Nutzer wollte stattdessen den ECHTEN Schalter von Anfang an sichtbar, mit Führung erst beim Klick
  statt vorab per Fließtext. Umgesetzt: `duoCompareCardHtml()`s noch-nicht-verknüpfter Zweig
  (`if(!state.duoCode){...}`) rendert jetzt denselben `data-act="toggle-soul-link"`-Button samt
  Info-Icon wie der bereits-verknüpfte Zweig, optisch identisch (`<div class="card-top">` mit Button +
  `iconBtn(...,"soullink",...)`), anstelle des v1.9.83-Hinweissatzes im `loc-sub`-Text (der wieder
  entfernt wurde, da er durch den jetzt sichtbaren Button selbst überflüssig ist). Der
  `toggle-soul-link`-Klick-Handler bekam davor eine Weiche:
  ```js
  else if(act==="toggle-soul-link"){
    if(!state.duoCode){
      openSheet(`<h3>Soul-Link-Modus</h3>
        <div class="loc-sub" style="margin-bottom:14px;">Dafür braucht es zuerst einen verknüpften
        Partner-Spielstand - trag oben bei „Duo-Vergleich" den Sync-Code deines Partners ein und
        starte den Vergleich, dann lässt sich der Soul-Link-Modus hier aktivieren.</div>
        <div class="sheet-footer"><button class="btn btn-primary btn-block" data-act="close-sheet">OK</button></div>`);
      return;
    }
    state.soulLinkMode = !state.soulLinkMode;
    saveState(); render();
  }
  ```
  - ohne verknüpften Partner bricht der Klick VOR dem eigentlichen Umschalten ab und zeigt stattdessen
  ein `openSheet(...)`-Infofenster, `state.soulLinkMode` bleibt dabei unverändert; mit verknüpftem
  Partner läuft der Klick unverändert wie zuvor durch. `SETTINGS_HELP.duocompare` entsprechend ein
  zweites Mal angepasst - erwähnt jetzt, dass der Schalter direkt auf der Karte sichtbar ist, aber
  erst nach dem Verknüpfen tatsächlich aktivierbar wird. Verifiziert per Playwright (drei Fälle):
  Button existiert bereits ohne `state.duoCode`; ein Klick darauf zeigt das Hinweis-Sheet und lässt
  `state.soulLinkMode` unangetastet; nach Setzen von `state.duoCode` schaltet derselbe Button
  `state.soulLinkMode` wie gewohnt um. **Lehre, die die obige v1.9.83-Lehre nicht ersetzt, sondern
  ergänzt:** ein bedingt FUNKTIONSFÄHIGES Element (hier: der Soul-Link-Schalter, der ohne Partner
  ins Leere liefe) muss nicht zwangsläufig auch bedingt SICHTBAR sein - "erst zeigen, wenn nutzbar"
  und "immer zeigen, aber bei fehlender Voraussetzung führend abfangen" sind zwei unterschiedliche,
  beide gültige Lösungen für dasselbe Discoverability-Problem, und die zweite (vom Nutzer hier
  bevorzugte) braucht einen Guard direkt im Klick-Handler statt (nur) einen Text-Hinweis davor - bei
  künftigen ähnlichen Fällen die Nutzerpräferenz erfragen/beachten statt automatisch zur ersten
  Variante zu greifen.
- **Einstellungs-Kacheln blieben über einen Tab-Wechsel hinweg aufgeklappt (seit v1.9.85):**
  Nutzerwunsch: "wenn von den Einstellungen wieder auf einen anderen Tab gewechselt wird sollen die
  offenen Kacheln in den Einstellungen immer eingeklappt werden." `expandedSettingsGroups` (welche
  Einstellungs-Kapitel gerade aufgeklappt sind, siehe `settingsGroupHtml()`) war zwar schon immer
  bewusst NICHT persistiert (Kommentar bei der Deklaration: "jeder Reload startet eingeklappt"), blieb
  aber innerhalb EINER laufenden Sitzung über beliebig viele Tab-Wechsel hinweg unverändert bestehen -
  wer z. B. "Duell & Bosse" aufgeklappt und dann zu einem anderen Tab gewechselt hatte, fand es beim
  nächsten Öffnen der Einstellungen weiterhin aufgeklappt vor. Fix: neue Variable `lastRenderedTab`
  (deklariert direkt neben `expandedSettingsGroups`), die sich merkt, in welchem Tab `render()`
  zuletzt lief. Am Kopf von `render()`:
  ```js
  function render(){
    if(lastRenderedTab==="settings" && activeTab!=="settings") expandedSettingsGroups.clear();
    lastRenderedTab = activeTab;
    ...
  ```
  leert das die Menge automatisch genau in dem Moment, in dem `activeTab` von "settings" auf einen
  anderen Tab wechselt - die Einstellungen starten dadurch beim nächsten Öffnen wieder komplett
  eingeklappt. **Bewusst zentral in `render()` geprüft statt an jeder einzelnen Stelle, die
  `activeTab` setzt** (Tab-Klick-Handler, Wisch-Geste zwischen Tabs, die geführte Tour, der
  `#settings`-Deeplink-Parameter beim Laden - mindestens fünf verschiedene Stellen im Code) - `render()`
  läuft nach jeder einzelnen dieser Stellen ohnehin garantiert genau einmal, ein einziger
  Anschlusspunkt genügt dadurch, statt das Leeren an fünf potenziell künftig noch mehr werdenden
  Stellen einzeln nachzuziehen. **Exakt dasselbe Prinzip wie bei der v1.9.78-Auto-Sync-Debounce-Logik
  weiter oben** (zentral an `saveState()` gehängt statt an einzelne Änderungsstellen) und bewusst NICHT
  das Muster aus dem Boss-Kachel-`id`-Feld-Fund von v1.9.69 (dort fehlte ein Feld an einer von
  mehreren strukturell ähnlichen, aber unabhängig gepflegten Stellen) - hier gibt es dagegen ohnehin
  schon einen einzigen gemeinsamen Durchlaufpunkt (`render()`), der nur genutzt werden musste, statt
  ihn künstlich nachzubilden. Verifiziert per Playwright: sowohl über direkte `activeTab`-Zustands-
  änderung als auch über echte `.tab[data-tab]`-Klicks leert sich `expandedSettingsGroups`
  zuverlässig beim Verlassen der Einstellungen; ein Wechsel zwischen zwei Nicht-Einstellungen-Tabs
  bleibt wie erwartet folgenlos (die Menge ist zu diesem Zeitpunkt ohnehin schon leer).
- **Mehr Übersicht in den Einstellungen — Suche, Sortierung, Zähler, Alle-einklappen (seit
  v1.9.86):** direkte Anschlussfrage im selben Gespräch wie die beiden Punkte oben ("erfolge sollen
  die freigeschalteten automatisch nach oben sortiert werden und auch hier sollen die erfolge
  eingeklappt sein ich möchte für mehr übersicht in den einstellungen sorgen was gibt es sonst noch
  für möglichkeiten?"), gefolgt von "setze alle um" nachdem vier zusätzliche Ideen vorgeschlagen
  wurden (Suchfeld, Zähler in Kapitel-Headern, Alle-einklappen-Button, Kapitel-Reihenfolge nach
  Nutzungshäufigkeit). Fünf Änderungen in einer Runde:
  1. **Erfolge sortiert:** in der `(()=>{...})()`-IIFE, die bisher `ACHIEVEMENTS.map(...)` direkt
     ohne Sortierung rendert hat, jetzt zuerst `const sortedAchievements = [...ACHIEVEMENTS].sort((a,b)=>{
     const au = state.achievements[a.id]?0:1; const bu = state.achievements[b.id]?0:1; return au-bu; })`
     - `Array.prototype.sort` ist seit ES2019 spezifikationsgemäß stabil, die Reihenfolge innerhalb
     "freigeschaltet"/"gesperrt" bleibt dadurch jeweils erhalten, nur die zwei Gruppen selbst wandern
     nach vorn/hinten.
  2. **Erfolge-Liste eingeklappt:** die inzwischen 56 Erfolge (`ACHIEVEMENTS.length`) bekommen einen
     eigenen, verschachtelten Auf-/Zuklapp-Toggle - `settingsGroupHtml("achievements-list", ...)`
     wird ein zweites Mal aufgerufen, diesmal INNERHALB des Kartenkörpers der äußeren
     `settingsGroupHtml("achievements", ...)`-Gruppe. Das funktioniert beliebig verschachtelt, weil
     `settingsGroupHtml()` rein über den übergebenen String-Key gegen `expandedSettingsGroups`
     arbeitet, keine Kenntnis von einer Eltern-Kind-Beziehung braucht. Startet eingeklappt, selbst
     wenn das äußere Kapitel "Erfolge & Titel" aufgeklappt ist.
  3. **Zähler im (weiterhin eingeklappten) Kapitel-Titel:** `settingsGroupHtml()`s `label`-Parameter
     bekam für zwei Kapitel dynamische Zusätze - "Erfolge & Titel (12/56)" bzw. bei mindestens einer
     ausgeblendeten Region "Regionen (2 ausgeblendet)" (sonst bleibt der Titel schlicht "Regionen").
     Andere Kapitel (Spielstände, Regeln, Darstellung, Werkzeuge, App-Info) bekamen bewusst KEINEN
     erzwungenen Zähler - es gibt dort keine einzelne, natürliche Kennzahl, die das Kapitel auf einen
     Blick zusammenfasst, ein künstlicher Zähler wäre nur Lärm gewesen.
  4. **"Alle Kapitel einklappen"-Button:** neuer `data-act="collapse-all-settings-groups"`-Handler
     (`expandedSettingsGroups.clear(); render();`) - bewusst per vollem `render()` statt der sonst
     für `toggle-settings-group` üblichen Direkt-DOM-Klassenumschaltung, weil hier potenziell
     mehrere Kapitel gleichzeitig zuklappen sollen (ein Einzel-Element-Toggle deckt das nicht ab) und
     ein seltener Sammel-Klick keine übersprungsfreie Einzel-Animation braucht, anders als das
     häufige Auf-/Zuklappen einzelner Kapitel.
  5. **Volltextsuche über alle Kapitel** - technisch der größte Umbau: `renderSettings()` wurde
     aufgeteilt in einen festen Rahmen (Fortschritt-Karten + `settingsSearchBarHtml()`, enthält das
     `#settingsSearchInput`-Feld) und `<div id="settingsGroupsContainer">${settingsGroupsHtml()}</div>`.
     `settingsGroupsHtml()` baut jetzt alle Kapitel zunächst als Datensatz-Array `{key,label,html}`
     statt sie sofort String an String zu hängen - genau das macht sowohl Filtern (Suche) als auch
     Neusortieren (Punkt "Kapitel-Reihenfolge" unten) möglich, ohne mehrere verstreute
     String-Konkatenationen einzeln anpassen zu müssen. Die Suche selbst prüft simpel per
     `(label + " " + html).replace(/<[^>]*>/g," ").toLowerCase().includes(query)` - deckt dadurch
     automatisch jede künftig hinzugefügte Karte ab, ohne separat gepflegt werden zu müssen. Treffer-
     Kapitel werden über einen neuen vierten Parameter `forceExpanded` an `settingsGroupHtml(key,
     label, bodyHtml, forceExpanded)` sichtbar aufgeklappt gerendert (`const expanded = forceExpanded
     || expandedSettingsGroups.has(key);`) - WICHTIG: das verändert `expandedSettingsGroups` selbst
     NICHT, nur die Render-Entscheidung für diesen einen Aufruf. Nach Löschen der Suche fällt der
     Zustand dadurch automatisch auf den vorherigen (meist eingeklappten) zurück, ohne dass Kapitel,
     die man nur wegen eines Treffers sah, danach fälschlich als "manuell aufgeklappt" hängen
     bleiben. Für die verschachtelte Erfolge-Liste gibt es eine zweite, unabhängige
     `achievementsMatchesQuery`-Prüfung direkt gegen Erfolgsnamen/-beschreibungen (nicht einfach vom
     äußeren Kapitel-Treffer abgeleitet) - ein Treffer z. B. im "Aktiver Titel"-Kartentext öffnet
     zwar das äußere Kapitel, aber nicht sinnlos die ganze 56er-Liste, während ein Treffer in einem
     konkreten Erfolgsnamen beide öffnet. Bei keinem Treffer erscheint `"Keine Treffer für „…“."`.
     **Kritischer Punkt, von Anfang an bedacht, nicht nachträglich als Bug gefunden:** der
     `input`-Event-Handler für `#settingsSearchInput` aktualisiert bei jedem Tastendruck NUR
     `document.getElementById("settingsGroupsContainer").innerHTML`, NICHT das gesamte `#content` -
     ein voller `render()`-Aufruf pro Zeichen hätte das Suchfeld-Element selbst mit ausgetauscht und
     dabei sofort den Tastaturfokus gekostet (nur ein Zeichen pro Tap möglich gewesen). Exakt
     dasselbe bereits etablierte Grundmuster wie bei der Standort-Suche
     (`locationSearchInput`→`#locationSearchResults`) und der Box-Suche
     (`boxSearchInput`→`#boxResults`) - dort aus demselben Grund ebenfalls nur ein separates
     Ergebnis-Element statt der ganzen Oberfläche aktualisiert.
  **Nebeneffekt, in derselben Runde mit erledigt:** Kapitel-Reihenfolge von der ursprünglichen
  Aufbau-Reihenfolge (Spielstände, Duell & Bosse, Regeln, Erfolge & Titel, Regionen, Darstellung,
  Werkzeuge, App-Info) auf eine nach geschätzter Nutzungshäufigkeit sortierte Reihenfolge geändert
  (`SETTINGS_GROUP_ORDER = ["rules","saves","duel-bosses","achievements","regions","appearance",
  "tools","app-info"]`, angewendet per `groups.sort((a,b)=> SETTINGS_GROUP_ORDER.indexOf(a.key) -
  SETTINGS_GROUP_ORDER.indexOf(b.key))`) - Regeln/Spielstände (inkl. Cloud-Sync)/Duell & Bosse werden
  während eines laufenden Runs am ehesten nochmal angefasst, App-Info/Werkzeuge/Darstellung praktisch
  nur einmalig oder gar nicht. Rein kosmetisch, keiner der Gruppen-Keys hat sich geändert -
  `expandedSettingsGroups`-Einträge bleiben dadurch über die Umsortierung hinweg gültig. Verifiziert
  per Playwright (alle Punkte in einem Testlauf): Sortierung der Erfolge (56 Zeilen, erste zwei
  künstlich freigeschaltete stehen vorn, keine freigeschaltete Zeile erscheint nach einer gesperrten);
  verschachtelte Liste bleibt eingeklappt, obwohl das äußere Kapitel aufgeklappt ist; Kapitel-Titel
  zeigt "Erfolge & Titel (2/56)" schon im eingeklappten Zustand; Tippen von "Vibration" filtert auf
  genau das "Darstellung"-Kapitel, klappt es auf UND das Eingabefeld behält nachweislich den Fokus
  (`document.activeElement.id`) sowie den eingegebenen Wert; Tippen eines Erfolgsnamens klappt sowohl
  das äußere Kapitel als auch die verschachtelte Liste auf; eine erfundene Zeichenkette zeigt den
  "Keine Treffer"-Text; Leeren des Suchfelds stellt den eingeklappten Ausgangszustand wieder her; der
  "Alle einklappen"-Button leert `expandedSettingsGroups` zuverlässig; die gerenderte Kapitel-
  Reihenfolge entspricht `SETTINGS_GROUP_ORDER`.
- **Icons, kurze Kennzahlen, Toggle-Switches, gebündelte Karten & "Erweitert"-Bereiche (seit
  v1.9.87):** direkte Folgerunde derselben "mehr Übersicht"-Konversation wie oben. Nutzer bat um
  Ideen, die "gerne genutzt werden" und "leicht verständlich, nicht überladen" wirken; auf Vorschlag
  von fünf Optionen (Icon pro Kapitel, kurze Zusammenfassung, "Erweitert"-Unterteilung, Toggle-
  Switches statt Buttons, verwandte Schalter bündeln) kam "die zwei und die anderen drei umsetzen" -
  alle fünf in einer Runde:
  1. **`SETTINGS_GROUP_ICONS`** (neue Konstante direkt vor `settingsGroupHtml()`) - Emoji-Map nur für
     die acht TOP-LEVEL-Kapitel-Keys (`rules:"📜"`, `saves:"💾"`, `"duel-bosses":"⚔️"`,
     `achievements:"🏆"`, `regions:"🗺️"`, `appearance:"🎨"`, `tools:"🧰"`, `"app-info":"ℹ️"`) -
     bewusst NICHT für verschachtelte Keys wie `"achievements-list"`/`"saves-advanced"` gepflegt,
     damit Unterebenen optisch klar untergeordnet bleiben statt mit demselben Gewicht wie die
     Haupt-Navigation zu wirken. Emoji statt neu gezeichneter SVGs - passt zum bereits etablierten
     leichtgewichtigen Icon-Stil dieser Codebase (ACHIEVEMENTS-Icons, "🧪 Tour-Idee", "❔"/"🔒").
  2. **`settingsGroupHtml(key, label, bodyHtml, forceExpanded, summary)`** bekam einen fünften,
     optionalen `summary`-Parameter - eine kurze Kennzahl ("2/4 aktiv", "2 ausgeblendet"), die in
     einem EIGENEN `<span class="settings-group-summary">` rechts neben dem Titel steht, auch im
     eingeklappten Zustand sichtbar. Löst die v1.9.86-Übergangslösung ab, die "Erfolge & Titel
     (12/56)" noch direkt in den `label`-String einbackte - jetzt sauber getrennt, damit der Titel
     für die Suche unabhängig von der Zahl bleibt und beide unterschiedlich gestylt werden können
     (Titel fett, Zahl matt/klein). Neu berechnete Summaries: "Regeln" zählt die vier ECHTEN
     Ein/Aus-Einstellungen (`dupesWarning`, `nicknameRequired`, `hidePostgame`, `trackDeathCause`) -
     bewusst OHNE die Regelwerk-Checkliste (`houseRulesCardHtml()`), die rein zur Dokumentation dient
     und keine App-Logik beeinflusst, siehe eigener Kommentar dort; "Darstellung" zählt
     `vibrationEnabled`+`colorBlindSafeMode` (die Farbschema-Wahl selbst ist kein Boolean, zählt
     nicht mit). "Spielstände", "Duell & Bosse", "Werkzeuge", "App-Info" bekommen bewusst KEINE
     Summary - dort gibt es keine einzelne, natürliche Kennzahl, die das Kapitel zusammenfasst (exakt
     dieselbe "nicht jedes Kapitel braucht eine künstliche Zahl"-Regel wie schon in v1.9.86).
  3. **Toggle-Switches** (`.switch`/`.switch-track`/`.switch-thumb`, klassisches Checkbox-Hack-Muster:
     eine unsichtbar gemachte, aber weiter fokussier-/klickbare native `<input type="checkbox">`
     treibt per CSS-Geschwisterselektor `:checked + .switch-track` Track-Farbe und Thumb-Position) -
     ersetzen die zuvor vollbreiten `btn ${x?"btn-primary":"btn-secondary"} btn-block`-Buttons mit
     Text "Aktiviert"/"Deaktiviert" für alle SIEBEN echten Ein/Aus-Einstellungen: `dupesWarning`,
     `nicknameRequired`, `hidePostgame`, `trackDeathCause`, `trackBossTeams`, `vibrationEnabled`,
     `colorBlindSafeMode`. Neuer Helfer `switchHtml(stateKey, checked)` baut das Markup zentral,
     `data-toggle-setting="${stateKey}"` trägt direkt den echten `state`-Feldnamen. **Bewusst NICHT**
     für Checklisten (Schlüsselitems, Regelwerk-Checkliste, beide weiterhin `.check-row` mit echter
     Checkbox) übernommen - dort ist "das habe ich erledigt" semantisch etwas anderes als "dieses
     Feature ist an", ein Switch wäre dort die falsche Interaktions-Metapher. Die bereits vorhandene
     `autoSyncEnabled`-Checkbox in `cloudSyncCardHtml()` wurde bewusst NICHT mit umgestellt - sie ist
     bereits kompakt (inline in einer längeren Karte, kein vollbreiter Button) und liegt in einem
     gerade erst in dieser Sitzung angefassten, funktional sensiblen Bereich (Soul-Link/Auto-Sync-
     Debounce) - kosmetische Vereinheitlichung dort war den zusätzlichen Berührungsaufwand nicht wert.
     **Ein einziger generischer `input`-Handler** (`if(e.target.dataset.toggleSetting){ state[key] =
     e.target.checked; saveState(); ...; document.getElementById("settingsGroupsContainer").innerHTML
     = settingsGroupsHtml(); }`) ersetzt die bisherigen SIEBEN einzelnen `toggle-X`-Klick-Handler
     (ersatzlos gelöscht, keine Karteileichen) - `vibrationEnabled`s Sonderfall (sofortiges
     `vibrateFeedback(35)` beim Einschalten als Demo-Feedback) blieb dabei als einzige
     Feldnamen-Sonderprüfung erhalten. Bewusst KEIN volles `render()`, nur der Container wird neu
     gezeichnet - aktualisiert nebenbei automatisch die "X/Y aktiv"-Kennzahl im Kapitel-Titel, ohne
     den Rest der App unnötig neu zu rendern.
  4. **Gebündelte Karten:** die vier "Regeln"-Schalter stehen jetzt als vier `.switch-row`-Zeilen in
     EINER Karte statt vier einzelner Karten, ebenso die beiden "Darstellung"-Schalter (Vibration,
     Farbenblind-Symbole) - "Gegner-Team tracken" (nur ein Schalter in "Duell & Bosse") blieb trotzdem
     als eigene, jetzt aber kompaktere Karte, da es dort nichts zum Bündeln gibt. Die bisher IMMER
     sichtbaren Erklärungstexte unter jedem Button (z. B. "Warnt beim Fangen, wenn die Spezies schon
     existiert...") wanderten dafür hinter neue "?"-Hilfe-Icons - fünf neue `SETTINGS_HELP`-Einträge
     (`hidepostgame`, `deathcause`, `bossteams`, `vibration`, `colorblind`), Text 1:1 aus den
     bisherigen `loc-sub`-Absätzen übernommen, keine Information ging verloren, nur der Ort wechselte
     von "immer sichtbar" zu "auf Wunsch abrufbar" - dieselbe Behandlung, die Dupes-Warnung und
     Nickname-Pflicht schon vorher hatten. Automatisch auch in der "Ausführlichen Tour"
     (`featureIndexResultsHtml()`, iteriert über ALLE `SETTINGS_HELP`-Einträge) mit aufgeführt, ohne
     zusätzlichen Code.
  5. **"Erweitert"-Unterteilung:** drei neue verschachtelte Toggle-Sektionen nach demselben Muster wie
     die "Erfolge"-Liste aus v1.9.86 (`settingsGroupHtml()` innerhalb eines Kapitel-Bodys erneut
     aufgerufen) - `"saves-advanced"` (Randomizer-Seed, typischerweise einmal zu Run-Beginn gesetzt),
     `"duel-bosses-advanced"` (Boss-Level-Boost, ebenfalls eine einmalige Randomizer-Konfiguration)
     und `"tools-advanced"` (die experimentelle "🧪 Tour-Idee"-Vorschau, ein Nischen-Feature für
     Feedback-Zwecke). Alle drei stehen bewusst als LETZTES Element ihres jeweiligen Kapitels
     (übliches Muster: Kernfunktionen zuerst, Seltenes ganz unten). Neuer Helfer
     `textIncludesQuery(label, html, query)` (ersetzt die vorher inline in der Such-Filterfunktion
     stehende Textextraktion) wird sowohl für die äußere Kapitel-Filterung als auch für jede der drei
     neuen "Erweitert"-Sektionen einzeln aufgerufen, damit ein Suchtreffer im jeweiligen Inhalt (z. B.
     "Randomizer") automatisch auch die verschachtelte Sektion mit aufklappt, nicht nur das äußere
     Kapitel.
  Verifiziert per Playwright: Icons erscheinen nur bei den acht Top-Level-Keys, fehlen bei
  verschachtelten; "Regeln"/"Darstellung" zeigen "2/4 aktiv"/"1/2 aktiv" schon eingeklappt; alle drei
  "Erweitert"-Bereiche existieren und starten eingeklappt; ein Klick auf einen Schalter ändert
  sowohl `state[key]` als auch sofort die Kennzahl im Kapitel-Titel (ohne Seiteneffekt auf andere
  offene Kapitel); die "Regeln"-Karte enthält exakt vier gebündelte Schalter-Zeilen; eine Suche nach
  "Randomizer" klappt sowohl "Spielstände" als auch den verschachtelten "Erweitert"-Bereich
  automatisch auf, ohne den Fokus im Suchfeld zu verlieren; alle fünf neuen Hilfe-Einträge sind über
  `SETTINGS_HELP` abrufbar; keine toten `data-act="toggle-X"`-Referenzen der sieben ersetzten
  Buttons bleiben im Code zurück.

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

## "Tour-Idee"-Vorschau landete bei fortgeschrittenem Spielstand außerhalb des Bildschirms (behoben in v1.9.92)

Nutzerfund: "die tour idee funktioniert im artefakt gut aber in der pwa nicht da ist das feld
irgendwo ausserhalb des bildschirms vermute ich" - die experimentelle `TOUR_CYCLES.catching`-Vorschau
(Werkzeuge → Erweitert → "🧪 Tour-Idee: Der Weg eines Fangs") funktionierte in einem frisch
getesteten Spielstand einwandfrei, aber nicht im Nutzers echtem, weit fortgeschrittenen PWA-
Spielstand. **Wichtige Klarstellung im Gespräch, nicht vorschnell als Plattformunterschied
akzeptieren:** auf Nachfrage stellte sich heraus, dass es NICHT wirklich "Artifact vs. PWA" war,
sondern "frischer Test-Spielstand vs. echter, fortgeschrittener Spielstand" - der Fehler hängt am
SPIELFORTSCHRITT, nicht an der Auslieferungsform. Zwei ineinandergreifende, unabhängig gefundene
Ursachen (per Playwright mit einem realistisch simulierten Fortschritt - 20 bereits gefangene,
eingeklappte Standorte plus eine zurückgestellte aktuelle Kachel - reproduziert):
1. **Falscher Selektor:** die erste Station zielte auf `'#content .card[data-loc]'` (die
   erste Standort-Kachel im DOM). Bei einem fortgeschrittenen Spielstand ist das oft eine längst
   ERLEDIGTE Kachel, die in der automatisch eingeklappten "erledigt"-Sammelgruppe liegt (siehe
   Einklapp-Mechanik-Eintrag oben) - `getBoundingClientRect()` liefert dafür trotzdem eine Position,
   nur eben eine, die nichts mit dem sichtbaren Bereich zu tun hat, sobald man versucht, dorthin zu
   scrollen (der eingeklappte Bereich nimmt ja keinen echten Scroll-Platz ein). Fix: statt eines
   starren Selektors denselben `effectiveCurrentLocId()` + `expandCollapseGroupsForLocation()`-
   Mechanismus wiederverwenden, den Standort-Suche/Karten-Sprung (`jump-to-location-result`, siehe
   Standort-Suche-Eintrag oben) bereits nutzen - liefert immer eine tatsächlich vorhandene, offene
   Kachel und klappt deren Sammelgruppe (falls zurückgestellt) VOR dem `render()` auf.
2. **Feste Warte-Frist statt echtem Abwarten, die eigentliche Wurzel des Funds:** selbst mit dem
   richtigen Ziel maß `placeCycleTip()` die Position IMMER exakt 450ms nach dem Aufruf von
   `targetEl.scrollIntoView({behavior:"smooth"})` - eine geratene feste Frist, die für die kurze
   Scrollstrecke eines frischen Testspielstands ausreichte, bei einem echten, langen Spielstand
   (Zielkachel liegt oft mehrere tausend Pixel tiefer im Dokument, weil viele zuvor gefangene
   Standorte darüber eingeklappt sind) aber bei Weitem nicht - die Messung erfolgte dadurch MITTEN in
   der noch laufenden Scroll-Animation, Spotlight und Tipp positionierten sich entsprechend auf einer
   noch nicht fertig gescrollten Zwischenposition, weit außerhalb des sichtbaren Bereichs. **Erster
   Lösungsversuch verworfen:** ein rAF-Loop, der auf "Position 3 Frames in Folge unverändert" wartet,
   erwies sich beim Testen als UNZUVERLÄSSIG (in eigenen Playwright-Wiederholungsläufen ca. 2 von 3
   Mal falsch-positiv) - in den allerersten Frames nach dem Aufruf von `scrollIntoView()` liest man
   oft noch dieselbe (alte, noch unbewegte) Position, weil die native Scroll-Animation ihren ersten
   sichtbaren Schritt noch gar nicht gemacht hat - das sieht "stabil" aus, ist aber der Startzustand,
   nicht das Ziel. Eine erste Gegenmaßnahme (erst ab beobachteter Bewegung zu zählen anfangen, mit
   Sonderfall "gar keine Bewegung nach mehreren Frames = kein Scrollen nötig") reduzierte das Problem,
   löste es aber nicht zuverlässig, da auch "mehrere Frames ohne Bewegung" bei einer langen
   Scrollstrecke fälschlich als "kein Scrollen nötig" fehlinterpretiert werden kann, wenn der Browser
   die Animation nur etwas langsamer anlaufen lässt. **Tatsächlicher Fix:** das `scrollend`-Event des
   scrollenden Containers (`#content`) direkt abwarten, statt die Position selbst zu beobachten -
   feuert genau einmal, wenn eine Scroll-Bewegung (inkl. "smooth") abgeschlossen ist, unabhängig von
   Distanz/Timing. Mit `setTimeout`-Notausstieg (700ms) als Fallback für Browser ohne `scrollend`-
   Unterstützung (ältere Safari-Versionen - derselbe bereits mehrfach dokumentierte Sonderfall dieser
   Codebase) oder falls gar kein Scrollen nötig war (Ziel bereits sichtbar, dann feuert nie ein
   Scroll-Event). **Verallgemeinerbare Lehre:** bei einem `scrollIntoView({behavior:"smooth"})` NIE
   eine geratene feste Wartezeit vor einer nachfolgenden Positionsmessung einbauen, egal wie
   plausibel sie beim Testen mit kurzen Distanzen wirkt - reale Scrollstrecken in einem fortgeschrittenen
   Spielstand können um Größenordnungen länger sein als in jedem Test-Spielstand. Ebenso: eine
   "Position seit N Frames unverändert"-Heuristik allein ist KEIN zuverlässiger Ersatz für ein
   echtes Abschluss-Event, da sie am Anfang (vor Bewegungsbeginn) genauso "stabil" aussieht wie am
   Ende (nach Bewegungsende) - wo ein natives `scrollend`/Transitionend-Äquivalent existiert, dieses
   bevorzugen, mit Timeout nur als Fallback-Netz, nicht als primäre Logik.

## Bekannter offener UX-/QoL-Backlog (Stand v1.9.90)

Sammlung von Ideen zur Verbesserung des Nutzererlebnisses, auf Nutzerwunsch ("nimm die Themen mal
ins Backlog auf") gesammelt statt sofort umgesetzt - noch keine davon ist implementiert, keine
Priorisierung/Reihenfolge impliziert:

- **Onboarding-Tour kuratieren, sobald "das große Ganze" steht (Nutzerwunsch, v1.9.92):**
  "ich möchte es in diesem stil für weitere inhalte und wenn wir dann das grosse ganze haben möchte
  ich mit den wichtigsten die welcome tour machen und den rest in die weiterführenden infos packen" -
  bezieht sich auf zwei bereits bestehende, unterschiedliche Hilfe-Ebenen: die kurze
  "Erste-Schritte-Tour" (`ONBOARDING_STEPS`, aktive Spotlight-Führung durch die echte Oberfläche,
  läuft beim ersten Start automatisch) und die "Ausführliche Tour" (`openFeatureIndex()`,
  durchsuchbare Themen-Übersicht über ALLE `SETTINGS_HELP`-Einträge zum Nachschlagen). Sobald
  Version 2.0 erreicht ist (alle Editionen vollständig, siehe Meilenstein oben) und damit "das große
  Ganze" feststeht: die kurze Tour bewusst auf die WICHTIGSTEN Kernfunktionen straffen/kuratieren
  (nicht jede seither hinzugekommene Funktion dort unterbringen), alles andere bleibt/wandert in die
  Ausführliche Tour als Nachschlagewerk. Explizit NICHT jetzt schon umsetzen - erst wenn der
  Funktionsumfang mit v2.0 tatsächlich steht, sonst müsste die Kuration bei jeder weiteren
  Funktionsergänzung wiederholt werden. Der erste Teil der Nutzeräußerung ("in diesem Stil für
  weitere Inhalte") bestätigt nur die bereits gelebte Praxis dieser Datei - ausführliche,
  präzedenzfall-zitierende Einträge pro Fund/Feature - explizit weiter so.

- **Barrierefreiheit:** nur 11 `aria-label`-Attribute im gesamten Code, aber deutlich mehr
  icon-only-Buttons (Mon-Aktionen `.icon-act`, Sheet-Schließen, Bearbeiten-Icons etc.) - für
  Screenreader-Nutzer aktuell lückenhaft beschriftet. Zusätzlich denkbar: eine eigene, von der
  System-Textgröße unabhängige Schriftgrößen-Einstellung, falls kleine Chips/Labels auf Dauer
  schwer lesbar sind.
- **Gefühlte Performance:** statt des reinen "?"-Platzhalters (`mon-sprite-placeholder`) beim ersten
  Sprite-Laden ein dezentes Shimmer/Pulse-Skeleton - passend zum in v1.9.89/90 begonnenen visuellen
  Polish der Kartengrafik-Marker. Bei sehr langen Editionen (Hoenn 79 Standorte, umfangreiche Box)
  ggf. eine Ergebnis-Begrenzung/"mehr laden" statt alles auf einmal zu rendern, falls das je spürbar
  ruckelt (aktuell kein bekannter konkreter Fall, nur vorsorglich notiert).
- **Auffindbarkeit neuer Funktionen:** ein kleines "Neu"-Badge auf Einstellungs-Kapiteln, die seit
  dem letzten Öffnen ein Update bekommen haben (ließe sich aus dem ohnehin versionierten Changelog
  ableiten) - würde dasselbe Grundproblem lösen wie der Soul-Link-Discoverability-Fund (v1.9.83/84):
  neue, bedingt sichtbare Funktionen bleiben sonst leicht unentdeckt.
- **Datensicherheit:** JSON-Export/-Import gibt es bereits (siehe `a.download =
  ...+"_export.json"` bzw. der `<input type="file">`-Import-Weg) - zusätzlich denkbar wäre ein
  automatisches, rollierendes LOKALES Backup (z. B. die letzten 3 Speicherstände als Snapshot in
  einem eigenen `localStorage`-Fach), unabhängig von Cloud-Sync, als zusätzliches Sicherheitsnetz
  gegen versehentliches Überschreiben/Löschen.
- **Auswertung/Motivation:** die bereits an anderer Stelle dokumentierte "Nemesis-Pokémon"-Idee
  (siehe Backlog-Absatz beim Todesursache-Tracking-Eintrag, v1.9.82) ist dank `deathBossId`
  technisch bereits vorbereitet - reine Auszählung, kein neues Datenmodell nötig. Zusätzlich denkbar:
  eine teilbare Bild-Karte des Run-Rückblicks (Editions-Logo, Orden, Team, Todesursachen als
  Screenshot-artige Zusammenfassung) zum Teilen/Sichern - der Recap-Text existiert schon
  (`runRecapNarrative()`/`runRecapInsights()`), nur nicht als teilbares Bild.
- **Kleinigkeit, kein Feature, eher ein bei dieser Gelegenheit gefundener Fehler:**
  `pwa/manifest.json`s `description` beschreibt die App noch als "Offline-Tracker für
  Pokémon-Nuzlocke-Runs über 14 Editionen (Gen 1-5)" - das ist seit Kalos/Hoenn (Gen 6) längst
  überholt und sollte bei Gelegenheit aktualisiert werden, unabhängig von den Ideen oben.

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
