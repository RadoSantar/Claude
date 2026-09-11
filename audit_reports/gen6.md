# Rechercheaudit Runde 2 (Wiederholung) — Generation 6: Kalos (X/Y)

Stand: recherchiert, noch **nicht** in `nuzlocke-v2-editionen.html` umgesetzt. Quellen: Bulbapedia
(Trainer-Einzelseiten - zuverlässiger als Zusammenfassungen von Serebii/PokéDB per Suche, siehe
`CLAUDE.md`), PokéWiki (deutsche Namen), Cross-Check gegen `KALOS_LOCATIONS`/`KALOS_BOSSES`/
`KALOS_BOSS_AFTER` in `nuzlocke-v2-editionen.html`.

Hinweis zur Historie: Der alte Detailbericht zu Kalos (`audit_reports/gen6.md` in einer früheren
Sitzung) ging mit einer abgestürzten Konversation verloren, ohne je committet worden zu sein - nur
eine kurze Stichpunktliste überlebte im Changelog. Dieser Bericht ist eine komplette Neu-Recherche,
kein Wiederherstellungsversuch der alten Notizen - und dabei deutlich umfangreicher ausgefallen als
die alte Kurzfassung vermuten ließ (siehe 2.1/2.2 unten).

---

## Teil 1: Standorte

### 1.1 Bestätigt korrekt / vollständig (keine Änderung nötig)

Alle 32 bereits vorhandenen Standorte (Escissia bis Batika City) wurden gegen die vollständige
Bulbapedia-Ortsliste für Kalos abgeglichen - Namen und Reihenfolge stimmen. Insbesondere „Hotelruine"
(Lost Hotel, Route 15) ist korrekt und vollständig, keine falsche Vermutung.

### 1.2 Fund: Fehlender Standort — Omega-Höhle (Terminus Cave)

Bestätigt genau die alte Vermutung aus dem Changelog ("Omega-Höhle fehlt als Ort"). Die Omega-Höhle
liegt am Ostende von Route 18, mit eigener Wildpokémon-Tabelle (Lv.46-48: u.a. Sandamer, Rizeros,
Despoteon/Lairon, Iksbat/Noibat, Ariados, Donarion/Durant) und ist Fundort des Legendären Zygarde -
die Zygarde-Kammer selbst ist erst nach dem Halle-der-Meister-Eintrag zugänglich, der Rest der Höhle
schon während der Haupthandlung. Vorschlag: neuer Standort „Omega-Höhle" zwischen „Route 18" und
„Mosaia" einfügen.

### 1.3 Fund: Fehlender Standort — Route 22

Bisher komplett nicht in `KALOS_LOCATIONS` enthalten. Route 22 verbindet Nouvaria City mit der
Siegesstraße und ist laut Recherche die letzte Route vor der Top Vier - Wildpokémon im Gras (u.a.
Enton, Dodu, Dummisel, Bidiza, Azurill, Riolu, Bunnelby, Litleo) größtenteils schon während der
Haupthandlung zugänglich, ein gelber Blumenfleck per Wasserfall erst im Postgame. Vorschlag: neuer
Standort „Route 22" zwischen „Route 21" und „Siegesstraße" einfügen.

### 1.4 Randnotiz, bewusst NICHT als fehlend eingestuft: Meerestitanenhöhle (Sea Spirit's Den)

Kleine Höhle nördlich der Azurbucht - unter normalen Umständen komplett leer (keine Wildpokémon).
Erst im Postgame, nachdem einer der drei legendären Vögel (Arktos/Zapdos/Lavados, abhängig vom
Starter) elfmal als wanderndes Pokémon angetroffen wurde, flüchtet er sich hierher und wird fangbar.
Analog zu Liberty Garden (Einall-Audit) ein Sonderfall mit eigener, aufwendiger Vorbedingung statt
eines normalen Wildpokémon-Standorts - auf Wunsch nachträglich ergänzbar, aber kein klarer Fehlbefund
wie 1.2/1.3.

---

## Teil 2: Bosse

### 2.1 Fund: Komplettes Team-Flare-Wissenschaftler-Quintett fehlt (9 Kämpfe, nicht nur 5)

Der alte Kurzeintrag im Changelog sprach nur vage von einem „fehlenden Quartett" - die Recherche
zeigt einen deutlich größeren Umfang: **Aliana, Bryony und Celosia haben je zwei echte Kämpfe,
Mable ebenfalls zwei, nur Xerosic genau einen** - macht 9 fehlende Bosseinträge statt der
angenommenen 4-5:

| Name | 1. Kampf (Ort, Ass, Level) | 2. Kampf (Ort, Ass, Level) |
|---|---|---|
| **Aliana** | Kalos-Kraftwerk, Kapoera (Mightyena), Lv.38 | Labor von Flordelis, Tandrak (Druddigon), Lv.48 |
| **Celosia** | Pokéball-Fabrik (Doppelkampf mit Bryony + Rivale), Lv.41 | Labor von Flordelis, Skorgro (Drapion), Lv.48 |
| **Bryony** | Pokéball-Fabrik (Doppelkampf mit Celosia + Rivale), Lv.41 | Labor von Flordelis, Caesurio (Bisharp), Lv.48 |
| **Mable** | Frosthöhle, Hunduster (Houndoom), Lv.48 | Labor von Flordelis, Snibunna (Weavile), Lv.48 |
| **Xerosic** | — (kein früherer Kampf) | Labor von Flordelis, Calamanero (Malamar), Lv.48 |

Die Pokéball-Fabrik-Doppelkämpfe (Celosia+Bryony gemeinsam gegen dich UND deinen Rivalen im
Team) sind ECHTE Kämpfe gegen die beiden - anders als die B2W2-Matisse-Situation aus dem letzten
Audit ist hier der Rivale dein Verbündeter GEGEN Team Flare, nicht Team Flare dein Verbündeter -
gehören also regulär als Team-Flare-Bosskarte rein, keine Ausnahme wie bei den Matisse-Fällen.

Alle deutschen Ass-Namen und Level an mehreren unabhängigen Bulbapedia-Trainerseiten gegengeprüft
und per PokéWiki/Suche verifiziert (Caesurio=Bisharp, Calamanero=Malamar - beide zunächst unsicher,
jetzt bestätigt).

### 2.2 Fund: Lysandre hat 3 Kämpfe, nicht 2 - und der letzte Geheimbasis-Kampf ist zweistufig

Bestätigt exakt die alte Vermutung ("erster Lysandre-Kampf hat falsches Level (36 statt 49)"; "zweiter
Flordelis-Kampf in der Geheimbasis ist nur als eine statt zwei Kampfstufen abgebildet") - und liefert
jetzt die genauen Zahlen:

1. **Labor von Flordelis** (Ende des Labors, nach allen 5 Wissenschaftlern): Ass Garados, **Lv.49**
   (App aktuell: `lysandre1`, Lv.36 - **falsch**, korrekt wäre 49).
2. **Flare-Geheimbasis, erster Kampf** (1F, direkt beim Betreten): Ass Garados, **Lv.51** - fehlt
   komplett in der App.
3. **Flare-Geheimbasis, finaler Kampf** (nach dem Weg mit den Verbündeten-Doppelkämpfen gegen
   Team-Flare-Rüpel/-Vorstände mit dem Rivalen zusammen): Ass Garados (jetzt Mega-Garados, hält
   Garadosnit), **Lv.53** - App aktuell: `lysandre2`, Lv.50 (falsch, sollte die zweite von zwei
   Stufen mit Lv.53 sein, nicht eine einzelne Stufe mit Lv.50).

Vorschlag: `lysandre1` auf Lv.49 korrigieren, neuen `lysandre-hq1` bei „Flare-Geheimbasis" mit Lv.51
ergänzen, `lysandre2` (finale Stufe) auf Lv.53 korrigieren.

### 2.3 Fund: Rivale — 4 von 5 Levels falsch, 1 kompletter Kampf fehlt

Bestätigt die alte Vermutung, mit genauen Werten:

| App-Eintrag | Ort | App-Level | Echtes Level (Ass) |
|---|---|---|---|
| rival1 | Turm der Erkenntnis | 29 | **30** |
| rival2 | Tempera City | 32 | **33** |
| rival3 | Route 14 | 36 | **37** |
| — | **Fluxia City** (vor Astrids/Olympias Arena) | — | **fehlt komplett, Lv.46** |
| rival4 | Siegesstraße | 60 | **61** |

Die drei vorhandenen Level sind also tatsächlich alle exakt 1 zu niedrig (bestätigt die alte
Vermutung), UND der in Fluxia City fehlende Kampf ist ebenfalls bestätigt (Ass-Level 46, direkt vor
Astrids Arena - danach bittet der Rivale zwar um einen Rückkampf, der wird aber durch Lysandres
Ankündigung storniert, findet also nicht statt). Damit hat der Rivale in der Haupthandlung 5 echte
Kämpfe statt 4.

Zur Einordnung, bewusst NICHT als fehlend einzustufen: der Rivale begleitet dich zusätzlich als
Verbündeter in mehreren Multi-Battles gegen Dritte (Route 7 vs. Trevor & Tierno, Leuchthöhle vs.
Team-Flare-Rüpel, Pokéball-Fabrik vs. Celosia & Bryony - letzteres bereits oben unter 2.1 als
Team-Flare-Kampf erfasst) - das sind keine Kämpfe gegen ihn und gehören nicht als zusätzlicher
Rivalenkampf rein, exakt dasselbe Muster wie bei der B2W2-Matisse-Korrektur im letzten Audit.

### 2.4 Fund: Connies Ass falsch (Lucario statt Resladero/Hawlucha)

Bestätigt die alte Vermutung. Korrinas (Connies) echtes Ass ist Resladero (Hawlucha), nicht Lucario -
Level bereits korrekt bei 32. Lucario gehört zu einer separaten Zusatzbegegnung (nicht Teil ihres
regulären Arenakampf-Teams).

### 2.5 Bestätigt korrekt (keine Änderung nötig)

- **Viola**: Vivillon Lv.12 ✓
- **Grant**: Balgoras (Tyrunt) Lv.25 ✓
- **Ramos**: Chevrumm (Gogoat) Lv.34 ✓
- **Clemont**: Elezard (Heliolisk) Lv.37 ✓
- **Valerie**: Feelinara (Sylveon) Lv.42 ✓
- **Olympia**: Psiaugon (Meowstic ♂) Lv.48 ✓
- **Wulfric**: Arktilas (Avalugg) Lv.59 ✓
- **Top Vier**: Pachira/Fiaro (Talonflame), Thymelot/Durengard (Aegislash), Dracena/UHaFnir
  (Noivern - ungewöhnliche, aber offizielle Schreibweise, gegengeprüft), Narcisse/Thanathora
  (Barbaracle), je Lv.65 ✓
- **Champion Diantha**: Guardevoir Lv.68 ✓ (deutsche Schreibweise mit "u" ist korrekt, kein Tippfehler)

---

## Zusammenfassung: was zu tun wäre (Vorschlag, noch nicht umgesetzt)

| # | Fund | Umfang |
|---|------|--------|
| 1.2 | Standort „Omega-Höhle" ergänzen (Route 18) | Klein |
| 1.3 | Standort „Route 22" ergänzen (vor Siegesstraße) | Klein |
| 1.4 | Meerestitanenhöhle - optional, Sonderfall | Optional |
| 2.1 | 9 Team-Flare-Wissenschaftler-Kämpfe ergänzen (Aliana/Bryony/Celosia/Mable je 2, Xerosic 1) | Groß |
| 2.2 | Lysandre: `lysandre1` auf Lv.49 korrigieren, neuen HQ-Erstkampf (Lv.51) ergänzen, `lysandre2` auf Lv.53 korrigieren | Mittel |
| 2.3 | Rivale: 3 bestehende Level je +1 korrigieren, neuen Fluxia-City-Kampf (Lv.46) ergänzen | Mittel |
| 2.4 | Connies Ass auf Resladero (Hawlucha) korrigieren | Trivial |

Nichts hiervon wurde bereits in `nuzlocke-v2-editionen.html` umgesetzt - Gegenchecken und Freigabe
steht noch aus.
