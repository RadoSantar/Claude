# Sprite-Konsistenz-Audit: Kanto/Johto (Gen 1-2, Teil 4 - Abschluss)

Letzter Teil des mit Gen 5 (`gen5-sprites.md`), Gen 4 (`gen4-sprites.md`) und Gen 3
(`gen3-sprites.md`) begonnenen Sprite-Konsistenz-Audits. Nutzerbestätigt: animierte Sprites
existieren in dieser App bislang ausschließlich für Generation 1-5 (Generation 6+ nutzt durchweg
den modernen Pokémon-Masters-EX-Chibi-Stil, dort stellt sich die Animationsfrage nicht). Mit
diesem Teil ist der Audit über alle relevanten Generationen (1-5) abgeschlossen.

## Ausgangsbefund

Von den insgesamt 37 zu Audit-Beginn statischen Bosssprites entfallen 7 auf Kanto/Johto:
`Lorelei`, `Agathe` (beide Rot/Blau/Gelb, Top Vier), `Proton`, `Petrel`, `Ariana`, `Archer`
(HeartGold/SoulSilver, Team-Rocket-Vorstand) und `JessieJames` (Gelb-exklusiv, Team-Rocket-
Comic-Duo).

## Ergebnis: 0 von 7 ersetzbar

| Name | Edition | Grund |
|---|---|---|
| Lorelei | Rot/Blau/Gelb | Game-Boy/-Color-Ära (Rot/Grün/Gelb) - auf Bulbagarden Archives nur GB/GBC-Sprites (`Spr_RG_Lorelei`, `Spr_Y_Lorelei` u.&nbsp;Ä.) und moderne Pokémon-Masters-Chibi-Sprites (anderer Zeichenstil) verfügbar, keine im selben Pixel-Stil animierte Version |
| Agathe | Rot/Blau/Gelb | Gleicher Befund wie Lorelei |
| Proton | HeartGold/SoulSilver | Selbst die HGSS-Version auf Bulbagarden Archives (`Spr_HGSS_Proton.png`) ist statisch - anders als bei den 16 Johto-Arenaleitern (Falkner bis Lance, bereits seit v1.8/v1.9.10 animiert) wurde für die Team-Rocket-Vorstände offenbar nie eine animierte Fassung hochgeladen |
| Petrel | HeartGold/SoulSilver | Gleicher Befund |
| Ariana | HeartGold/SoulSilver | Gleicher Befund |
| Archer | HeartGold/SoulSilver | Gleicher Befund |
| JessieJames | Gelb (exklusiv) | Anime-Referenz-Duo, nur in der Gelben Edition (Game Boy) - keine Bulbagarden-Datei mit erkennbarem Namensmuster gefunden, weder als Duo-Sprite noch einzeln in diesem Kontext |

Alle 7 bleiben unverändert statisch - es handelt sich durchgehend um denselben Fall wie bereits bei
den Hoenn-Team-Bossen (siehe `gen3-sprites.md`): keine im selben Pixel-Stil animierte Quelle
verfügbar, nicht um eine versehentliche Quellenmischung wie ursprünglich bei Schwarz/Weiß.

## Nebenbefund (bereits in `gen3-sprites.md` dokumentiert, hier nur referenziert)

Der Rivale „Blau" (`Blue`-Sprite, u.&nbsp;a. `rival0`-`rival6`, Lv.&nbsp;5-53) nutzt bereits jetzt ein
animiertes Sprite - allerdings fälschlich das erwachsene HeartGold/SoulSilver-Arenaleiter-Artwork
statt eines zu seinem jugendlichen Rivalen-Auftritt passenden Designs. Reine Bild-Genauigkeitsfrage,
kein Fall für dieses Audit (das nur prüft, ob überhaupt animiert - hier ist es das ja bereits).

## Status

Kein Sprite in dieser Runde ersetzt (0 Kandidaten erfüllten die Kriterien). Damit ist der
generationsübergreifende Sprite-Konsistenz-Audit für Gen 1-5 abgeschlossen:

- **Gen 5** (Schwarz/Weiß): 15 von 16 ersetzt (v1.9.42)
- **Gen 4** (Sinnoh): 1 von 4 ersetzt (v1.9.43)
- **Gen 3** (Hoenn): 7 von 26 ersetzt (v1.9.44)
- **Gen 1/2** (Kanto/Johto): 0 von 7 ersetzbar (kein Fund, dieser Bericht)
- **Gen 1** (Rot/Blau, Stichprobe): bereits vollständig animiert, keine weitere Prüfung nötig

Insgesamt 23 Sprites über drei Versionen (v1.9.42-v1.9.44) auf animierte Quellen umgestellt, 14
bewusst statisch belassen (fehlende Quelle oder Outfit-Konflikt, jeweils dokumentiert), 3 weitere
zurückgestellt (Juan, Tate&amp;Liza x2 - Code-Änderung nötig statt reinem Datentausch).
