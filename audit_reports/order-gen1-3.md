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
