# Sprite-Konsistenz-Audit: Sinnoh (Gen 4, Teil 2)

Fortsetzung des mit Gen 5 (`gen5-sprites.md`) begonnenen generationsübergreifenden
Sprite-Konsistenz-Audits. Betroffene Editionen: Diamant/Perl, Platin, BDSP (BDSP nutzt eigene,
bereits animierte Chibi-Sprites aus v1.9.13 und ist hier nicht betroffen).

## Ausgangsbefund

4 der 18 Sinnoh-Bosssprites sind statisch: `SnBarry` (Rivale), `SnJupiter`, `SnMars`, `SnSaturn`
(Team-Galaktik-Vorstand). Die übrigen 14 (u.&nbsp;a. `SnRoark`, `SnGardenia`, `SnCyrus`,
`SnCynthia`) sind bereits animierte APNGs.

## Root Cause

Exakt dasselbe Muster wie bei Gen 5: die 14 bereits animierten Sprites stammen von der
**Platin-(Pt)-Version** des jeweiligen Sprites auf Bulbagarden Archives (`Spr_Pt_<Name>.png`),
die dort durchgehend als animiertes APNG vorliegt. Die 4 statischen sind dagegen byteidentisch
mit der **Diamant/Perl-(DP)-Version** (`Spr_DP_<Name>.png`), einzelbildrig.

## Ergebnis: nur 1 von 4 ersetzbar

| Name | DP (aktuell, statisch) | Pt-Version vorhanden? | Aktion |
|---|---|---|---|
| Barry | 873 B | Ja, `Spr_Pt_Barry.png`, 13.206 B, animiert, identisches Outfit, 80×80 | **Ersetzen** |
| Jupiter | 844 B | **Nein** - auf Bulbagarden existiert nur `Spr_DP_Jupiter.png`, keine separate Platin-Datei | Unverändert |
| Mars | 798 B | **Nein** - nur `Spr_DP_Mars.png` | Unverändert |
| Saturn | 863 B | **Nein** - nur `Spr_DP_Saturn.png` | Unverändert |

Für die drei Team-Galaktik-Vorstandsmitglieder existiert auf Bulbagarden Archives kein separates,
im selben Retro-Pixel-Stil animiertes Sprite - nur der bereits vorhandene statische DP/Pt-gemeinsame
Sprite sowie moderne Pokémon-Masters-EX-Chibi-Sprites (anderer Zeichenstil, wie er in dieser App erst
ab Kalos/Gen&nbsp;6 verwendet wird). Ein Ersatz durch Letzteres würde einen Stilbruch innerhalb
derselben Sinnoh-Edition erzeugen (Pixel-Look neben Chibi-Look) - dasselbe Prinzip, das laut
Changelog v1.9.10 bereits einmal bewusst so entschieden wurde ("...bleiben deshalb bewusst
unverändert... statt sie in schlechterer Qualität/anderem Stil neu zu beschaffen"). Bleiben daher
unverändert statisch, keine offene Aufgabe.

## Status

Umgesetzt in v1.9.43 (Barry ersetzt, Jupiter/Mars/Saturn bewusst unverändert und hier dokumentiert
als abgeschlossen geprüft, nicht als offener Punkt).
