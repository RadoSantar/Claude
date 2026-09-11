# Rechercheaudit Runde 2 (Wiederholung) — Generation 5: Einall (Schwarz/Weiß, Schwarz2/Weiß2)

Stand: recherchiert für v1.9.38 (Vorschlag), noch **nicht** in `nuzlocke-v2-editionen.html` umgesetzt.
Quellen: Bulbapedia (Trainer-/Orts-Seiten), Serebii.net, PokéWiki (deutsche Namen), Cross-Check
gegen die aktuellen Datenstrukturen `EINALL_BW_BOSSES`/`EINALL_BW_LOCATIONS` und
`EINALL_B2W2_BOSSES`/`EINALL_B2W2_LOCATIONS` in `nuzlocke-v2-editionen.html`.

Hinweis zur Historie: Ein früherer Audit-Durchlauf zu Einall wurde bereits in v1.9.36 teilweise
umgesetzt (P2-Labor, Tiefkühlcontainer, Marea-Zugbrücke-Fangmöglichkeit). Die damaligen
Detailberichte (`audit_reports/gen6.md`/`gen7.md`/`gen8.md` für Kalos/Alola/Galar) wurden nie
committet und sind mit der abgestürzten Sitzung verloren gegangen — dieser Bericht hier wird
deshalb bewusst vollständig neu und direkt im Repo abgelegt, damit er nicht erneut verloren gehen
kann.

---

## Teil 1: Schwarz/Weiß (BW1)

### 1.1 Bestätigt korrekt (keine Änderung nötig)

Gegengeprüft (Bulbapedia/Serebii) und mit den App-Daten exakt übereinstimmend:

- **Cheren** (alle 7 Vorkämpfe + Postgame-Rückkampf): Level 5/8/14/22/26/35/45/67 an
  Avenitia/Orion City/Route 3/Route 4/Route 5/[siehe 1.2]/Route 10/Siegesstraße — alle korrekt.
- **Bianca/Bell** (alle 5 Vorkämpfe + Postgame-Rückkampf): Level 5/7/20/28/40/65 an
  Avenitia/Route 2/Stratos City/Marea City/Route 8/Avenitia — alle korrekt.
- **N**: Felilou (Purrloin) Lv.7 in Gavina; Schallquap (Tympole, Ass bestätigt per Team-Reihenfolge
  Pidove→Timburr→Tympole) Lv.13 in Septerna City; Symvolara (Sigilyph, Ass bestätigt: Sandile→
  Scraggy→Darumaka→Sigilyph) Lv.22 in Rayono City; Klikk (Klink, Ass bestätigt: Boldore→Ferroseed→
  Joltik→Klink) Lv.28 in Elektrolithhöhle; Finalkampf Zekrom/Reshiram Lv.52 im Schloss von N
  (Ass an erster Position in Schwarz, letzter in Weiß — Notiz in der App bereits korrekt).
- **Striaton-Trio**: Benny/Vegimak (Grasstarter-Konter für Wasserstarter), Maik/Grillmak
  (Feuerstarter-Konter für Grasstarter), Colin/Sodamak (Wasserstarter-Konter für Feuerstarter) je
  Lv.14 — Zuordnung und Level exakt bestätigt.
- **Lenora** (Kukmarda/Watchog Lv.20), **Burgh** (Matrifol/Leavanny Lv.23), **Elesa**
  (Zebritz/Zebstrika Lv.27), **Clay** (Stalobor/Excadrill Lv.31), **Skyla** (Swaroness/Swanna
  Lv.35), **Brycen** (Siberio/Beartic Lv.39) — alle Ass-Level exakt bestätigt.
- **Drayden/Lysander** (Schwarz) vs. **Iris/Lilia** (Weiß): Maxax/Haxorus Lv.43 in beiden Versionen
  — deutsche Namen (Lysander/Lilia) und Versionszuordnung bestätigt (PokéWiki).
- **Top Vier**: Anissa/Skelabra, Astor/Caesurio, Kattlea/Morbitesse, Eugen/Wie-Shu je Lv.50 —
  bestätigt.
- **Ghetsis**: Trikephalo/Hydreigon Lv.54 — bestätigt.
- **Champion Alder/Lauro**: Ramoth/Volcarona Lv.77 — bestätigt.
- **Cynthia-Cameo** (Ondula/Kattleas Villa): Knakrack/Garchomp Lv.77, saisonal Frühling **und**
  Sommer (nicht nur Sommer, wie eine Quelle zunächst nahelegte — Bulbapedia bestätigt beide
  Jahreszeiten, deckt sich mit der App-Notiz) — bestätigt.

### 1.2 Fund: Cheren6-Kampf an falschem Standort verortet

Der sechste Cheren-Kampf (`cheren6`, Ass-Level 35) hängt aktuell an **„Wendelberg"** (Twist
Mountain). Laut Recherche (mehrere Quellen unabhängig bestätigt) findet dieser Kampf aber auf
**Route 7**, direkt am Fuß des Aufstiegs zum Wendelberg statt — noch bevor man den Berg selbst
betritt (danach überreicht Champion Lauro als Zeuge des Kampfes VM03 Surfer). Vorschlag: `cheren6`
von `"Einall|Wendelberg"` nach `"Einall|Route 7"` in `EINALL_BW_BOSS_AFTER` verschieben.

### 1.3 Fund: Fehlender Standort — Bucht von Ondula (Undella Bay)

Die **Bucht von Ondula** (engl. Undella Bay, PokéWiki bestätigt) liegt östlich von Ondula
(Undella Town) und ist bereits in der Original-Edition per Surfer erreichbar — keine Item-/
Nationaldex-Voraussetzung. Sie hat eine eigene, komplette Wildpokémon-Tabelle (u.a. Wingull,
Pelipper, Mantax/Mantyke, Seemon/Spheal-Familie winters, Wailmer/Wailross-Familie, Mantine;
per Superangel zusätzlich Schalellos/Remoraid, Muschas/Shellder, Liebiskus/Luvdisc) und ist
bisher **komplett nicht** in `EINALL_BW_LOCATIONS` enthalten. Die anschließenden Unterwasserruinen
(Abyssal Ruins/Unterwasserruine) haben laut Recherche dagegen **keine** Wildpokémon (nur Item-
Dungeon) und müssen entsprechend nicht ergänzt werden. Vorschlag: neuen Standort „Bucht von
Ondula" nach „Ondula" ergänzen.

Geprüft und bewusst NICHT als fehlend eingestuft: Anville Town (keine Wildpokémon, reine
Bahnstation-Stadt, bestätigt per Bulbapedia) und Liberty Garden (nur per inzwischen nicht mehr
verfügbarem Nintendo-Event-Gegenstand erreichbar, einmaliger Scripted-Fang statt echter
Wildpokémon-Fläche — auf Wunsch nachträglich ergänzbar, aber ein echter Sonderfall).

---

## Teil 2: Schwarz2/Weiß2 (B2W2)

### 2.1 Bestätigt korrekt (keine Änderung nötig)

- **Cheren** (jetzt Arenaleiter, Grundorden): Yorkleff/Lillipup Lv.13 — bestätigt.
- **Mica** (Giftorden): Rollum/Whirlipede Lv.18 — bestätigt.
- **Artie** (Käferorden): Matrifol/Leavanny Lv.24 — bestätigt.
- **Kamilla** (Voltorden): Zebritz/Zebstrika Lv.30 — bestätigt.
- **Turner** (Seismo-Orden): Stalobor/Excadrill Lv.33 — bestätigt.
- **Géraldine** (Jetorden): Swaroness/Swanna Lv.39 — bestätigt.
- **Lysander** (Legendenorden): Maxax/Haxorus Lv.48 — bestätigt.
- **Benson** (Wellenorden): Apoquallyp/Jellicent Lv.51 — bestätigt.
- **Colress**: Klikk/Klink Lv.23 auf Route 4 — bestätigt; Klikdiklak/Klinklang Lv.52 auf der
  Plasma-Fregatte (Rückkehr) — bestätigt. Level 25 beim PWT-Kampf ist plausibel (parallel zu
  Matisses eigenem Levelsprung 20→25), aber nicht einzeln quellenbestätigt.
- **Rubius** (ehemaliger Weiser „Rood", Zorua-Geschenk): Ass-Level 27 in Marea City — bestätigt
  (sein Team besteht laut Serebii aus zwei gleich starken Lv.27-Pokémon; welches davon als Ass
  „Fletiamo" geführt wird, ließ sich nicht einzeln nachschlagen — beim Spielen ggf. zu prüfen).
- **Zinzolin**, 1. Kampf (Tessera/Lacunosa Town): Sniebel/Sneasel Lv.44 — bestätigt.
- **Zinzolin**, 2. Kampf (Twindrake City/Opelucid City): Snibunna/Weavile Lv.48 — bestätigt.
- **Finstrio** (Schattentrio, Twindrake City): Absol Lv.48 — bestätigt.
- **Ghetsis** (Finalkampf, Riesengrotte): Trikephalo/Hydreigon Lv.52 — bestätigt.
- **Top Vier**: Anissa/Skelabra, Eugen/Wie-Shu, Astor/Caesurio, Kattlea/Morbitesse je Lv.58 —
  bestätigt.
- **Champion Lilia**: Maxax/Haxorus Lv.59 — bestätigt.

### 2.2 Fund: Rivale Matisse — 3 von 11 Kämpfen fehlen komplett

Laut Recherche (Bulbapedia Einzelkampf-Tabelle + Serebii-Gesamtübersicht, beide unabhängig
bestätigt) hat Hugh/Matisse **11** Kämpfe im echten Spiel, die App bildet aktuell nur **8** ab
(`matisse1`–`matisse8`). Es fehlen:

1. **Riesengrotte-Verbündeten-Kampf** (zwischen dem aktuellen `matisse7` in Tessera und
   `matisse8` auf der Siegesstraße): Ass-Level **50**, Doppelkampf als Verbündeter gegen Team
   Plasma — analog zum bereits vorhandenen `matisse5`-Verbündetenkampf auf der Plasma-Fregatte.
2. **Postgame-Rückkampf in Ondula** (Undella Town): Ass-Level **64**, vollständiges 6er-Team.
3. **Postgame-Finalkampf in Marea City** (Driftveil City — der eigentlich allerletzte
   Matisse-Kampf im Spiel, danach zieht er sich zurück): Ass-Level **67**, vollständiges 6er-Team.

Die genauen Nicht-Ass-Teammitglieder (Simisage/Simisear/Simipour, Unfezant, Bouffalant je nach
Kampf) wurden recherchiert, aber noch nicht bis ins letzte Detail für jeden der drei fehlenden
Kämpfe abgeglichen — beim Umsetzen zu vervollständigen.

### 2.3 Fund: Zinzolins 3. Kampf am falschen Standort + fehlender Standort „Strandgrotte"

Laut Recherche gibt es einen **dritten** Zinzolin-Kampf (Ass weiterhin Snibunna/Weavile, aber
**Lv.50**, als Doppelkampf zusammen mit Matisse gegen Zinzolin+Häscher), der auf **Route 21** am
Zugang zur **Strandgrotte** (engl. Seaside Cave, PokéWiki bestätigt) stattfindet — nicht auf der
„Plasma-Fregatte (Rückkehr)", wo die App ihn aktuell führt (`zinzolin3` unter
`"Einall|Plasma-Fregatte (Rückkehr)"`). Zusätzlich fehlt die **Strandgrotte selbst** komplett als
Standort: sie ist B2W2-exklusiv, liegt an Route 21 und hat eine eigene Wildpokémon-Tabelle (u.a.
Golduck, Woobat, Boldore, diverse Wasser-Pokémon per Surfer/Angel).

Vorschlag: `zinzolin3` von `"Einall|Plasma-Fregatte (Rückkehr)"` nach `"Einall|Route 21"`
verschieben (Level korrigieren auf 50, bereits korrekt) und neuen Standort „Strandgrotte" nach
Route 21 ergänzen.

### 2.4 Fund: Fehlende Schattentrio-Kämpfe vor dem Ghetsis-Finale

Vor dem eigentlichen Ghetsis-Kampf in der Riesengrotte gibt es laut Recherche **drei** zusätzliche
Kämpfe gegen das Schattentrio (bestätigt per Serebii, jeweils 2× Pawniard + ein drittes,
wechselndes Pokémon):

1. Ass Absol, Lv.51
2. Ass Accelgor, Lv.51
3. Ass Banette, Lv.51

Diese fehlen komplett in `EINALL_B2W2_BOSSES`/`EINALL_B2W2_BOSS_AFTER` — aktuell hängt an
„Riesengrotte" nur `ghetsis-final`.

### 2.5 Fund: Fehlender Standort — Bucht von Ondula (auch in B2W2 vorhanden)

Wie in Teil 1.3 beschrieben, existiert die Bucht von Ondula laut Recherche unverändert auch in
Schwarz2/Weiß2 (sie verbindet dort zusätzlich zur Strandgrotte) und fehlt ebenso in
`EINALL_B2W2_LOCATIONS`.

### 2.6 Bereits bekannt, hier nur bestätigt: fehlendes Postgame (Rückkehr nach West-Einall)

Die im Änderungsprotokoll bereits dokumentierte Lücke (nach der Liga zugängliche Original-
Unova-Kartenhälfte: Avenitia, Route 1–3, Gavina, Orion City, Septerna City, dazu Wunderbrücke,
P2-Labor, Route 17/18, Schwarze Stadt/Weißer Wald als B2W2-Pendant) wurde in der Grundrichtung
erneut bestätigt (u.a. wird Zugang zu Nuvema/Accumula/Striaton/Nacrene/Icirrus sowie Black
City/White Forest nach dem Champion-Sieg freigeschaltet). Zusätzlich böte sich als eigener,
optionaler Schritt an: das **PWT-Postgame** (Rückkämpfe gegen frühere Arenaleiter aller
Editionen sowie Bianca) und die **Unova Challenge** (Schwarzer Turm/Weiße Baumhöhle, 10 zufällige
Kampf-Etagen) — beides aber eher ein Stretch-Goal als Kern-Content, da hier keine neuen
Standard-Standorte/Fänge dahinterstecken, sondern Bonus-Kämpfe. Umfang weiterhin zu groß für
einen einzelnen Schritt, wie bereits im Changelog vermerkt.

---

## Zusammenfassung: was zu tun wäre (Vorschlag, noch nicht umgesetzt)

| # | Fund | Umfang |
|---|------|--------|
| 1.2 | `cheren6` von Wendelberg nach Route 7 verschieben | Trivial (1 Zeile) |
| 1.3 | Standort „Bucht von Ondula" in BW ergänzen | Klein (1 Standort + Wildpokémon-Tabelle) |
| 2.2 | 3 fehlende Matisse-Kämpfe ergänzen (Riesengrotte Lv.50, 2× Postgame Lv.64/67) | Mittel |
| 2.3 | `zinzolin3` nach Route 21 verschieben + Standort „Strandgrotte" ergänzen | Klein–Mittel |
| 2.4 | 3 fehlende Schattentrio-Kämpfe vor Ghetsis ergänzen | Klein–Mittel |
| 2.5 | Standort „Bucht von Ondula" in B2W2 ergänzen | Klein |
| 2.6 | Komplettes B2W2-Postgame (West-Einall-Rückkehr) | Groß, eigener Schritt (unverändert wie Changelog) |

Nichts hiervon wurde bereits in `nuzlocke-v2-editionen.html` umgesetzt — Gegenchecken und
Freigabe steht noch aus.
