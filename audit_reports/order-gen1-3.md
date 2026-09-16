# Rechercheaudit: Standort-REIHENFOLGE — Generation 1-3 (Kanto/Johto/Hoenn)

Stand: recherchiert, noch **nicht** in `nuzlocke-v2-editionen.html` umgesetzt. Geprüft wird laut
Auftrag **ausschließlich die Sequenz/Position** der Standorte in den 7 Location-Arrays, die die 10
Editionen der Generationen 1-3 abdecken — nicht Namen, Level, Bosse oder Vollständigkeit (das haben
frühere Audits bereits behandelt bzw. ist bekannter Backlog).

Quellen: Bulbapedia-Walkthrough-Serien **direkt per WebFetch** (nicht über Such-Zusammenfassungen),
je Edition `Walkthrough:Pokémon <Spiel>` und deren nummerierte Teile/Sections, ergänzend Bulbapedia-
Ortsartikel (z. B. `Kanto Route 2`, `Rusturf Tunnel`, `Power Plant`) für konkrete Freischalt-
Bedingungen (HM/Badge-Gating). Deutsche Namensprüfung punktuell via PokéWiki, wo eine Verwechslung
die Reihenfolgen-Analyse selbst betraf (siehe 4.3).

---

## 1. `KANTO_RB_LOCATIONS` (Rot/Blau)

Restliche Reihenfolge (Alabastia → Route 1 → Vertania City → Route 22 → Route 2 → Vertania-Wald →
Marmoria City → Route 3 → Mondberg → Route 4 → Azuria City → Route 24/25 → Route 5 → Unterführung →
Route 6 → Orania City → Route 11 → Route 9/10 → Felstunnel → Lavandia → Pokémon-Turm → Route 8 →
… → Route 16-18 → Fuchsania City → Route 19/20 → Seeschauminseln → Zinnoberinsel → Pokémon-Villa →
Route 21 → Vertania-Arena → Route 22 (Rückweg) → Route 23 → Siegesstraße → Pokémon-Liga →
Azuria-Höhle) stimmt gegen die Bulbapedia-Walkthrough-Teile 1-17 überein. Drei konkrete Abweichungen:

### 1.1 Fund: „Digdas Höhle" viel zu früh (vor Route 3, direkt nach Marmoria City)

Der Route-2-Zugang zur Digdas-Höhle ist im Original Rot/Blau durch einen zerschneidbaren Baum
blockiert, der erst mit HM01 Zerschneiden nutzbar ist — Zerschneiden erfordert den Kaskadenorden
(Misty/Azuria City), siehe Bulbapedia „Kanto Route 2". Die Höhle ist also frühestens nach Azuria
City erreichbar, nicht direkt nach Marmoria City. Die Walkthrough-Reihenfolge bestätigt das: Teil 7
listet „Route 11, Digdas Höhle, Route 2 (Ost), …" — zusammen mit Route 11, also nach Orania City
(Vermilion/S.S. Anne).

**Korrekte Position:** zwischen „Route 11" und „Route 9"/„Route 10" (nicht zwischen Marmoria City
und Route 3).

### 1.2 Fund: „Kraftwerk" viel zu früh (direkt nach Route 9/10, vor Felstunnel)

Das Kraftwerk ist laut Bulbapedia-Ortsartikel „Kanto Route 10" nur per Surfer erreichbar
(„Trainers whose Pokémon possess the ability to use Surf … can Surf east along the river …").
Surfer wird im Original erst sehr spät bekommen (Goldzähne-Quest am Zinnoberinsel-Herrenhaus →
Safari-Zone-Wärter in Fuchsania). Die Walkthrough-Reihenfolge bestätigt das: Teil 14 „Power Plant,
Viridian Gym" kommt erst NACH Zinnoberinsel/Route 21, direkt vor der Vertania-Arena.

**Korrekte Position:** zwischen „Route 21" und „Vertania-Arena" (nicht zwischen Route 9/10 und
Felstunnel).

### 1.3 Fund: „Saffronia City" steht vor „Route 7"/„Prismania City" — falsch herum

Saffronias Nordwächter lässt nur mit Tee aus Prismania City (Celadon) passieren — ein alter,
bekannter Fakt der Silph-Co.-Questreihe. Das bestätigt auch die App-eigene Boss-Level-Tabelle in
`KANTO_RB_BOSSES` selbst: Erika/Giovanni1 (an „Prismania City") haben Level 29, Sabrina/Rival5/
Giovanni2 (an „Saffronia City") haben Level 40/40/41 — die Prismania-Ereignisse liegen also
eindeutig VOR den Saffronia-Ereignissen, aber die Location-Liste listet „Saffronia City" (Pos. 27)
vor „Route 7"/„Prismania City" (Pos. 28-29).

**Korrekte Position:** „Route 7" und „Prismania City" vor „Saffronia City" (Reihenfolge tauschen).

---

## 2. `KANTO_YELLOW_LOCATIONS` (Gelb)

Identische Kanto-Karte wie Rot/Blau (Array ist eine bewusste 1:1-Kopie, siehe Datei-Kommentar) —
alle drei Funde 1.1-1.3 gelten hier unverändert, an denselben Positionen.

---

## 3. `KANTO_FRLG_LOCATIONS` (FeuerRot/BlattGrün)

Der Kanto-Teil ist wörtlich `...KANTO_RB_LOCATIONS` (Array-Spread, Zeile 2101) — die drei Funde
1.1-1.3 sind damit identisch geerbt.

**Sevii-Inseln-Teil separat geprüft, Reihenfolge bestätigt korrekt:** Eiland Eins/Zwei/Drei (samt
Bundbrücke/Beerenforst) vor Eiland Vier/Fünf/Sechs/Sieben stimmt mit dem bekannten Tri-Pass-
(nach Blaine, 7. Orden) vs. Rainbow-Pass-Gating (erst nach Nationaldex/Hall of Fame) überein.
Rocket-Lager auf Eiland Fünf nach Eiland-5-Weide, Tanibo-Ruinen auf Eiland Sieben nach dem
Trainerturm — beides passt zur bekannten Insel-Struktur. Kein Fund.

---

## 4. `GSC_LOCATIONS` (Gold/Silber/Kristall)

Grundstruktur (Neuborkia → Route 29 → Rosalia City → Route 31 → Viola City → Route 32 →
Alph-Ruinen → Einheitstunnel → Azalea City → Flegmon-Brunnen → Steineichenwald → … → Teak City →
Turmruine → … → Ebenholz City → Drachenhöhle → Route 26/27 → Silberberg) stimmt grob mit der
Bulbapedia-GS-Walkthrough überein. Drei Abweichungen im Mahagonia/Dukatia-Team-Rocket-Handlungsbogen:

### 4.1 Fund: „Rundfunkturm" + „Dukatia-Passage" viel zu früh (direkt nach Dukatia City, vor Nationalpark)

Bulbapedia bestätigt explizit (Walkthrough Teil 6 vs. Teil 12): beim ERSTEN Besuch in Dukatia City
(Goldenrod) ist vom Rundfunkturm-Vorfall noch nichts zu sehen — „the Radio Tower takeover is not
part of this first visit… it occurs later as a separate event." Die Team-Rocket-Übernahme des
Rundfunkturms passiert laut Teil 12 erst NACH dem kompletten Mahagonia-Bogen (Team-Rocket-Versteck,
See des Zorns, Pryce-Arena) — wörtlich: „this occurs after the Mahagony sequence… The Radio Tower
chapter comes as Part 12… after the player defeats them at the Mahogany Hideout and gym."

**Korrekte Position:** „Rundfunkturm" und „Dukatia-Passage" gehören zwischen „See des Zorns" und
„Route 44" (nicht zwischen Dukatia City und Route 34/Nationalpark).

### 4.2 Fund: „Team-Rocket-Versteck" steht vor „Route 43"/„See des Zorns" — falsch herum

Laut Bulbapedia-Walkthrough-Teil 11 lautet die Reihenfolge „Mahogany Town, Route 43, Lake of Rage,
Rocket Hideout, Mahogany Gym" — das versteckte Team-Rocket-Lager unter Mahagonias Fake-Markt wird
erst NACH dem Roter-Garados-Vorfall am See des Zorns relevant/betretbar, nicht direkt beim ersten
Betreten von Mahagonia City.

**Korrekte Position:** Mahagonia City → Route 43 → See des Zorns → Team-Rocket-Versteck (aktuell:
Mahagonia City → Team-Rocket-Versteck → Route 43 → See des Zorns).

### 4.3 Fund: Jasmines Standort steht vor Chucks Standort — falsch herum

Die App bindet „jasmine" (Stahlorden) an „Anemonia City" und „chuck"/Hartwig (Faustorden) an
„Oliviana City" — „Anemonia City" steht in der Location-Liste aber VOR „Oliviana City". Laut
App-eigenen Leveldaten (Hartwig/Chuck Lv. 30, Faustorden; Jasmin/Jasmine Lv. 35, Stahlorden) und
dem bekannten Spielablauf (der Cianwood-Abstecher inkl. Kampf gegen den Fels-/Kampf-Arenaleiter
liegt vor der Rückkehr nach Olivine für die Stahlorden-Arena) müsste der Chuck-Standort VOR dem
Jasmine-Standort erscheinen — aktuell ist es umgekehrt.

**Randnotiz (Namen, außerhalb des Auftragsumfangs dieses Reihenfolge-Audits):** Laut PokéWiki ist
„Anemonia City" die deutsche Bezeichnung für Cianwood City und „Oliviana City" für Olivine City —
exakt umgekehrt zu dem, was die Boss-Zuordnung in der App nahelegt (Chuck/Hartwig gehört nach
PokéWiki nach Anemonia = Cianwood, nicht nach Oliviana). Diese mögliche Namensverwechslung dürfte
die Ursache für Fund 4.3 sein, sollte aber in einem eigenen Namens-/Bossaudit behandelt werden, nicht
hier.

**Kanto-Teil (Postgame) nicht im Detail auf strikte Reihenfolge geprüft** — analog zur bestehenden
Projekt-Konvention für nicht-lineares Postgame-Gebiet.

---

## 5. `LOCATIONS_DEFAULT` (HeartGold/SoulSilver)

Der Johto-Teil ist strukturell identisch zu `GSC_LOCATIONS` (siehe Datei-Kommentar: „Karte weitgehend
identisch zu HGSS") — die Funde 4.1-4.3 gelten hier an denselben Positionen unverändert (Rundfunkturm/
Dukatia-Passage zu früh, Team-Rocket-Versteck vor Route 43/See des Zorns, Anemonia vor Oliviana).

### 5.1 Zusätzlicher Fund (nur HGSS): „Sinjoh-Ruinen" viel zu früh (direkt nach Alph-Ruinen)

Die Sinjoh-Ruinen sind laut eigenem Datei-Kommentar/Notiz ausschließlich per Geheimgeschehen-
Arceus-Event erreichbar (`noCatch:true`, kein regulärer Fang) — ein reines Gen-4-Crossover-
Postgame-Event, das nichts mit dem normalen Spielfortschritt durch die Alph-Ruinen zu tun hat.
Die aktuelle Position (direkt nach den reguldären Alph-Ruinen, ganz am Anfang der Johto-Liste)
suggeriert fälschlich, der Ort sei schon früh im Spiel relevant — exakt das Muster, vor dem
CLAUDE.md bezüglich früh erscheinender Postgame-Orte warnt (Präzedenzfall ORAS „Route 103
(Postgame)"). Sollte als eigene, ans Ende der Johto-Liste angehängte Kachel geführt werden statt
direkt neben den Alph-Ruinen.

**Kanto-Teil (Postgame) nicht geprüft:** anders als im Original Rot/Blau entfällt hier jegliches
HM-/Orden-Gating (alle HMs/Orden bereits aus Johto vorhanden, freies Reisen per S.S. Aqua) — es gibt
keine erzwungene Story-Reihenfolge mehr, eine „richtige" Sequenz lässt sich nicht sinnvoll gegen
einen Walkthrough verifizieren. Kein Fund, bewusst nicht geprüft.

---

## 6. `SMARAGD_LOCATIONS` (Rubin/Saphir/Smaragd)

Großteil der Reihenfolge (Wurzelheim → Route 101 → Rosaltstadt → Route 102/103 → Blütenburg City →
Blütenburgwald → Metarost City → … → Route 111-134 → Mossbach/Xeneroville-Umfeld → Siegesstraße →
Pokémon-Liga) stimmt gegen die Bulbapedia-RS-Walkthrough-Teile 1-23 überein. Eine Abweichung:

### 6.1 Fund: „Metaflurtunnel" + „Wiesenflur" viel zu früh (direkt nach Metarost City/Route 104)

Der Metaflur-Tunnel (Rusturf Tunnel) ist beim ersten Besuch von der Metarost-Seite (Rustboro) aus
gesperrt — laut Bulbapedia „wegen Bauarbeiten am Tunnel ist Verdanturf/Wiesenflur in der Anfangs-
phase des Spiels nicht durch den Tunnel erreichbar". Vollständig passierbar wird er erst nach einem
Kampf gegen einen Team-Magma/Aqua-Rüpel (nach dem Steinorden) UND dem späteren Einsatz von
Zerschlagen. Die Bulbapedia-Walkthrough-Teil-6-Überschrift „Mauville City, Mauville Gym, Route 117,
Verdanturf Town, Rusturf Tunnel (Revisited)" bestätigt: Wiesenflur wird normalerweise von Malvenfroh
City (Mauville) über Route 117 erreicht, NICHT direkt von Metarost City aus — der Tunnel wird erst
bei diesem zweiten Besuch („Revisited") frei.

**Korrekte Position:** „Wiesenflur" und „Metaflurtunnel" gehören zwischen „Malvenfroh City" und
„Route 111" (nach Faustauhaven/Granithöhle/Graphitport City/Route 110/Malvenfroh City), nicht direkt
nach Metarost City/Route 104.

Keine weiteren Funde — insbesondere die Reihenfolge rund um Wüstenruine/Feuriger Pfad/Schlotberg/
Steilpass/Bad Lavastadt (Team-Magma-Bogen) sowie Safari-Zone/Mt.-Pyre-Umfeld (Grabmal/Pyroberg) und
Mossbach/Küstenhöhle/Tiefseehöhle/Xeneroville (Team-Aqua/Sootopolis-Bogen) stimmen mit der
Walkthrough-Grobstruktur überein; kleinere Umstellungen innerhalb einzelner Nebenrouten (z. B. genaue
Position von Route 115 relativ zu Schlotberg) sind mangels erzwingendem Spielmechanik-Gate nicht
eindeutig als Fehler zu werten und werden hier bewusst nicht gemeldet.

---

## 7. `ORAS_LOCATIONS` (Omega Rubin/Alpha Saphir)

Baut per `SMARAGD_LOCATIONS[0][1].map(...)` direkt auf `SMARAGD_LOCATIONS` auf (nur eine Umbenennung:
„Schiffswrack" → „Seewoge Malvenfroh", an gleicher Position, keine Reihenfolgeänderung) plus zwei
ans Ende angehängte Postgame-Standorte. Damit gilt:

- **Fund 6.1 (Metaflurtunnel/Wiesenflur zu früh) ist identisch geerbt** und betrifft auch ORAS.
- Die zwei angehängten Standorte „Route 103 (Postgame)" und „Blütenburg City (Delta-Episode)" sind
  korrekt ans Ende der Liste gehängt (Delta-Episode ist echtes Postgame nach dem Champion-Sieg) —
  entspricht der etablierten Konvention, kein Fund.

---

## Zusammenfassung

| Array | Reihenfolge geprüft gegen | Funde |
|---|---|---|
| `KANTO_RB_LOCATIONS` | Bulbapedia RB-Walkthrough (Teile 1-17) | 3 (Digdas Höhle, Kraftwerk, Saffronia/Prismania) |
| `KANTO_YELLOW_LOCATIONS` | identisch zu RB (1:1-Kopie) | dieselben 3 |
| `KANTO_FRLG_LOCATIONS` | RB geerbt + Sevii-Inseln separat (Tri-/Rainbow-Pass) | dieselben 3 (Sevii-Teil: kein Fund) |
| `GSC_LOCATIONS` | Bulbapedia GS-Walkthrough (Teile 1-16) | 3 (Rundfunkturm/Dukatia-Passage, Team-Rocket-Versteck, Anemonia/Oliviana) |
| `LOCATIONS_DEFAULT` (HGSS) | Johto identisch zu GSC + eigene Prüfung | dieselben 3 + 1 (Sinjoh-Ruinen); Kanto-Postgame nicht geprüft |
| `SMARAGD_LOCATIONS` | Bulbapedia RS-Walkthrough (Teile 1-23) | 1 (Metaflurtunnel/Wiesenflur) |
| `ORAS_LOCATIONS` | baut auf Smaragd auf | dieselbe 1 geerbt; angehängte Postgame-Standorte korrekt |

Nichts hiervon wurde in `nuzlocke-v2-editionen.html` umgesetzt — Gegenchecken und Freigabe durch den
Nutzer steht laut Workflow noch aus, bevor Standort-Arrays verschoben werden.

---

## 8. Nachrecherche: Hoenn-Nebenrouten (Rustboro-Mauville-Lavaridge-Fortree-Bereich)

Vertiefung von Abschnitt 6 (`SMARAGD_LOCATIONS`), Auftrag: klären, ob es innerhalb des Abschnitts
zwischen „Route 111" und „Baumhausen City" (Fortree) weitere, bisher nicht gemeldete
Reihenfolge-Fehler gibt — insbesondere ein konkreter Verdacht zu „Route 117". Quellen: Bulbapedia-
Ortsartikel „Hoenn Route 111"–„Hoenn Route 119" (Abschnitt „Connecting areas") **einzeln per WebFetch**,
ergänzend `Walkthrough:Pokémon Emerald/Part 5` bis `/Part 10` (exakte Schrittfolge), sowie „Mirage
Tower", „Desert Ruins", „Fiery Path", „Trick House" und „Verdanturf Town" für Freischalt-Bedingungen.
Deutsche Namen zusätzlich gegen PokéWiki geprüft (Wunderturm, Sonnengrotte, Grabmal, Wüstenruine,
Wundereiland).

### 8.1 Bestätigt: Route-117-Verdacht war berechtigt

Bulbapedia „Hoenn Route 117", Connecting areas: **West = Verdanturf Town (Wiesenflur), Ost =
Mauville City (Malvenfroh City)** — Route 117 verbindet die beiden also tatsächlich direkt, wie
vermutet. `Walkthrough:Pokémon Emerald/Part 5` bestätigt zusätzlich die zeitliche Einordnung, Schritt
für Schritt: „Mauville City (Dynamo-Orden + Mopped-Rad) → … → Route 117 (Optional path leading
westward from Mauville City) → Verdanturf Town → Rusturf Tunnel (von der Wiesenflur-Seite aus, mit
Zerschlagen freigeräumt, HM04 Sturmangriff/Strength erhalten) → Route 116 → Route 118 (nur der
Mauville-nahe Stub, optional)". Bulbapedia „Verdanturf Town" bestätigt es explizit noch einmal:
„players reach Verdanturf via Route 117 from Mauville City first. The Rusturf Tunnel connection
becomes available only after progressing further" (Zerschlagen kommt erst nach dem Dynamo-Orden aus
Malvenfroh).

Das erweitert Fund 6.1 des Vorgänger-Audits: nicht nur „Wiesenflur"/„Metaflurtunnel" stehen zu früh
(bereits gemeldet und bestätigt), sondern **„Route 117" selbst — die Route, über die man Wiesenflur
überhaupt zum ersten Mal erreicht — fehlt an genau dieser Einfügestelle** und steht stattdessen, wie
vom Nutzer vermutet, weit später, gebündelt mit Route 115/118/119 nach dem kompletten
Team-Magma/Lavastadt-Bogen.

**Korrekte Position:** „Route 117" gehört zwischen „Rätselhaus" und „Wiesenflur" (ergänzt/vervoll-
ständigt Fund 6.1 aus Abschnitt 6 — dort fehlte nur die Erwähnung von Route 117 selbst). Empfohlene
Reihenfolge für den betroffenen Block: … Rätselhaus → **Route 117** → Wiesenflur → Metaflurtunnel →
(Route 116, s. Randnotiz unten) → Route 111 → …

**Randnotiz zu Route 116** (laut Auftrag bereits an anderer Stelle geklärt, hier nicht neu bewertet):
Bulbapedia „Hoenn Route 116" listet die Connecting areas als **West = Metarost City (Rustboro), Ost =
Rusturf Tunnel** — Route 116 hängt also strukturell an derselben Baustelle wie Metaflurtunnel/
Wiesenflur/Route 117 und wird laut `Walkthrough Part 5` ebenfalls erst NACH dem Dynamo-Orden „von der
Rustboro-Seite aus" vollständig erkundet (Tunnelers' Rest House erst nach dem Zerschlagen-Ereignis
zugänglich). Falls die Position von Route 116 tatsächlich noch nicht anderswo korrigiert wurde, gehört
sie in denselben Einfügeblock wie Route 117/Wiesenflur/Metaflurtunnel — das wird hier nur als Hinweis
festgehalten, nicht als eigener Fund gewertet, da laut Auftrag bereits vorher geklärt.

### 8.2 Neuer Fund: „Wüstenruine" + „Wunderturm" sitzen zu früh — dasselbe Muster wie Fund 6.1, nur einen Bogen weiter

Bulbapedia „Hoenn Route 111" (Connecting areas + Beschreibung): „the desert in the center of Route
111 cannot be traversed without the Go-Goggles" — beide Orte liegen mitten in dieser Wüste
(„Mirage Tower": „situated in the desert on Route 111"; „Desert Ruins": „situated in the desert of
Route 111", „in the south of the desert"). Die Go-Goggles selbst werden laut
`Walkthrough:Pokémon Emerald/Part 7` erst **nach dem Sieg über Flannery in der Bad-Lavastadt-Arena**
von May/Brendan überreicht. `Walkthrough Part 8` bestätigt die zeitliche Reihenfolge explizit als
allerersten Abschnitt nach dem Lavastadt/Chimney-Bogen: „Route 111 (desert section) – accessible with
Go-Goggles" → „Desert Ruins – sealed entrance, cannot enter yet" → „Mirage Tower – optional
exploration".

Aktuell stehen „Wunderturm" und „Wüstenruine" aber direkt nach „Route 111", **noch vor** „Feuriger
Pfad", „Route 112", „Route 113", „Laubwechselfeld", „Route 114", „Meteorfälle", „Schlotberg",
„Steilpass" und „Bad Lavastadt" — also vor genau dem Ort (Bad Lavastadt), der das einzige Gate für
diese beiden Kacheln überhaupt erst freischaltet. Exakt das gleiche Fehlermuster wie beim bereits
bestätigten Fund 6.1 (Metaflurtunnel/Wiesenflur vor ihrem eigenen Freischalt-Ereignis), nur einen
Handlungsbogen weiter hinten.

**Korrekte Position:** „Wüstenruine" und „Wunderturm" gehören NACH „Bad Lavastadt" (Go-Goggles-Erhalt),
z. B. direkt danach, vor „Route 115"/„Route 117" (neue Position, s. 8.1)/„Route 118"/„Route 119".

**Zusatzhinweis zu „Wüstenruine"** (App-Feld: „Nur Static-Fang: Regirock (einmalig)"): In Smaragd ist
zum tatsächlichen FANG von Regirock zusätzlich das Lösen des Siegelkammer-Rätsels nötig (reines
Smaragd-Feature; in Rubin/Saphir existiert dieses Zusatz-Gate nicht) — ein separates, deutlich
späteres Gate (Zugang nur per Tauchen/Unterwasser, faktisch Postgame-nah). Da `SMARAGD_LOCATIONS` von
allen drei Editionen gemeinsam genutzt wird und dieses Zusatz-Gate in Rubin/Saphir gar nicht existiert,
ist „nach Bad Lavastadt" (Go-Goggles) der für alle drei Editionen gültige kleinste gemeinsame Nenner.
Ob die Kachel für Smaragd spezifisch noch weiter nach hinten müsste, wäre eine gesonderte Entscheidung
außerhalb dieses Auftragsumfangs.

### 8.3 „Feuriger Pfad": Position im Kern bestätigt korrekt (kein eigener Fund)

Bulbapedia „Fiery Path": „connects Route 112 to Route 113 and Fallarbor Town"; „serves as a shortcut
to bypass Route 111's desert" für Spieler ohne Go-Goggles; „players can traverse Fiery Path without
special items" (kein Freischalt-Gate). `Walkthrough Part 6` bestätigt die Schrittfolge: „Route 111
(south) → Route 112 (south) → Fiery Path → Route 112 (north)/Route 111 (north) → Route 113 →
Fallarbor Town → Route 114".

Feuriger Pfad selbst braucht kein Gate und wird bereits VOR dem Chimney/Lavaridge-Bogen durchquert.
Seine aktuelle Position (direkt nach „Route 111", vor „Route 112") ist damit im Kern richtig — der
einzige Fehler in dieser Nachbarschaft war die falsche Position von „Wüstenruine"/„Wunderturm" davor
(siehe 8.2). Werden diese beiden entfernt, ergibt sich „Route 111 → Feuriger Pfad → Route 112 →
Route 113 → Laubwechselfeld → Route 114" — exakt die per Walkthrough belegte Reihenfolge.
**Position bestätigt korrekt, Beleg: Walkthrough Part 6 + Fiery-Path-Ortsartikel.**

### 8.4 Route 112, Route 113, Route 114: bestätigt korrekt

- **Route 112** — Connecting areas: Norden Mt. Chimney/Steilpass, Westen Bad Lavastadt, Süden
  Route 111. Walkthrough Part 6/7 bestätigt exakt diese Nachbarschaft (inkl. späterem
  Cable-Car-Zugang zum Schlotberg, der laut Ortsartikel bis zum Sieg über den Team-Magma/Aqua-Trupp
  bei Meteorfälle „blockiert" ist). **Position bestätigt korrekt.**
- **Route 113** — Connecting areas: Westen Laubwechselfeld, Osten Route 111. Walkthrough Part 6:
  „… Route 111 (Norden) → Route 113 → Fallarbor Town". Die App bildet dies über „Route 112 → Route 113
  → Laubwechselfeld" ab — da es in der App nur eine einzige „Route 111"-Kachel gibt (kein Nord/Süd-
  Split), ist die Nachbarschaft zu Route 112 die bestmögliche Abbildung derselben Sequenz.
  **Position bestätigt korrekt.**
- **Route 114** — Connecting areas: Westen Meteorfälle, Osten Laubwechselfeld. Walkthrough Part 6/7:
  „Laubwechselfeld → Route 114" ist der letzte Schritt vor Meteorfälle. **Position bestätigt korrekt.**

### 8.5 Route 115: keine eindeutige Position feststellbar — bestätigt die Einschätzung des Vorgänger-Audits

Bulbapedia „Hoenn Route 115", Connecting areas: **Norden = Meteorfälle, Süden = Metarost City
(Rustboro)**. Freischalt-Gate: „most of the route cannot be accessed" beim ersten Besuch; volle
Erkundung braucht Surfer („Surf is required to access the northern section"). `Walkthrough Part 7`
erwähnt Route 115 als „optional" auf dem Weg zum Schlotberg (Rückweg-Abstecher von Meteorfälle
Richtung Rustboro) — aber das führt NICHT weiter Richtung Baumhausen/Fortree, sondern zurück zum
Ausgangspunkt. `Walkthrough Part 8` listet Route 115 dagegen unter den optionalen Surfer-Gebieten,
die klar NACH Erhalt des Surfer-HM (Wallys Haus, nach dem Norman-Arenakampf, der wiederum nach
Bad Lavastadt liegt) erkundet werden.

Route 115 ist damit eine Sackgassen-Schleife zurück nach Metarost City, keine Zwischenstation auf dem
Weg nach Baumhausen. Ihr Freischalt-Gate (Surfer) liegt zeitlich zwar vor Route 117/118/119 (die
keinen Surfer brauchen), aber es gibt keinen erzwungenen Zeitpunkt, WANN genau ein Spieler diesen
Abstecher einbaut — er ist ebenso gut vor wie nach Route 117/118/119 möglich, je nachdem, wann der
Umweg über Rustboro gemacht wird. **Kein eindeutiger Fehler feststellbar** — die aktuelle Position
(nach Bad Lavastadt, vor Route 117/118/119, bzw. nach Einfügung von 8.1/8.2 dann nach
Wüstenruine/Wunderturm) bleibt eine plausible, aber nicht zwingend einzige korrekte Wahl. Das bestätigt
exakt die Ehrlichkeits-Einschätzung des Vorgänger-Audits aus Abschnitt 6 für diesen speziellen Fall.

### 8.6 Route 118, Route 119: bestätigt korrekt

- **Route 118** — Connecting areas: Westen Malvenfroh City, Norden Route 119, (Osten Route 123, nur
  ORAS). Ein kleiner, isolierter Stub direkt bei Mauville ist laut `Walkthrough Part 5` zwar schon
  früh optional begehbar, die vollständige Durchquerung Richtung Route 119/Fortree erfolgt laut
  `Walkthrough Part 9` aber erst nach dem zweiten Wattson-Besuch/Höhlenatelier(Neu Malvenfroh)-Vorfall,
  also NACH dem gesamten Lavastadt-Bogen. **Position bestätigt korrekt.**
- **Route 119** — Connecting areas: Süden Route 118, Norden Baumhausen. Gate: „muddy slope" (Mopped-
  Rad) sowie eine per Team-Magma/Aqua-Adminkampf im Wetterinstitut blockierte Brücke. `Walkthrough
  Part 10`: „Route 118 → Route 119 → Wetterinstitut (Adminkampf) → Route 119 (Rückweg, Rivalenkampf,
  HM Fliegen) → Baumhausen City". **Position bestätigt korrekt.**

Beide Routen sind korrekt nach dem Lavastadt-Bogen und vor Baumhausen City positioniert — hier besteht
kein Korrekturbedarf.

### 8.7 Namenszuordnungs-Klärungen (Auftragspunkt 6)

- **Wunderturm = Mirage Tower** (bestätigt) — liegt in der Wüste von Route 111, existiert nur in
  Smaragd (in Rubin/Saphir wird die Fossilienwahl anders gelöst, kein Wunderturm). Kein eigener
  Namensfund, aber siehe 8.2 zur Position.
- **Sonnengrotte = Scorched Slab** (Heatran-Fundort), **nicht** „Cave of Origin" — liegt nördlich von
  Route 120, also außerhalb des hier geprüften Bereichs. Position im Array (nach „Grabmal", vor
  „Route 121") unverändert plausibel, nicht Teil dieses Nachrecherche-Auftrags, nur zur Klarstellung
  dokumentiert.
- **Grabmal = Ancient Tomb** (Registeel-Fundort, an Route 120) — Namensvermutung des Auftrags war
  bereits korrekt.
- **Wüstenruine = Desert Ruins** (Regirock-Fundort, in der Wüste von Route 111) — Namensvermutung des
  Auftrags war bereits korrekt.
- **Wundereiland** ist ein eigenständiger, benannter Ort östlich von Floßbrunn (Pacifidlog Town) —
  **nicht** die Kampfzone/Battle Frontier, wie in der Auftrags-Platzhaltervermutung erwogen. Beide sind
  unabhängig existierende, unterschiedliche Orte im Array; keine Umbenennung nötig.
- **Rätselhaus = Trick House** (liegt an Route 110, Story-/Orden-gated pro Rätsel-Etage bis zum
  Champion-Sieg für die letzte Etage) — Namensvermutung des Auftrags war bereits korrekt, keine
  Positionsänderung nötig (bleibt weiterhin eine einzelne Sammel-Kachel für alle Etagen).

**Nicht geprüft** (außerhalb des angefragten Bereichs Route 111–119): „Graphitport City"/„Schiffswrack"
im Slateport-Umfeld vor Route 110 — die Unsicherheit in der Auftrags-Namenstabelle dort bleibt
unadressiert und müsste bei Bedarf in einem eigenen Namens-/Reihenfolge-Audit geklärt werden.

### Zusammenfassung Abschnitt 8

| Ort/Route | Status | Korrekte Position |
|---|---|---|
| Route 117 | **Fund** (Nutzer-Verdacht bestätigt) | zwischen „Rätselhaus" und „Wiesenflur" (vervollständigt Fund 6.1) |
| Wüstenruine | **Neuer Fund** | nach „Bad Lavastadt" (Go-Goggles-Gate) |
| Wunderturm | **Neuer Fund** | nach „Bad Lavastadt" (Go-Goggles-Gate), zusammen mit Wüstenruine |
| Feuriger Pfad | bestätigt korrekt | unverändert (direkt nach Route 111) |
| Route 112 | bestätigt korrekt | unverändert |
| Route 113 | bestätigt korrekt | unverändert |
| Route 114 | bestätigt korrekt | unverändert |
| Route 115 | keine eindeutige Position feststellbar | aktuelle Position plausibel, kein Fund |
| Route 118 | bestätigt korrekt | unverändert |
| Route 119 | bestätigt korrekt | unverändert |

Wie im Rest dieses Audits gilt: **nichts hiervon wurde in `nuzlocke-v2-editionen.html` umgesetzt** —
Gegenchecken und Freigabe durch den Nutzer stehen aus, bevor die betroffenen Standort-Arrays
verschoben werden.
