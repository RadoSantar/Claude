# Sprite-Konsistenz-Audit: Einall/Schwarz-Weiß (Gen 5, Teil 1)

Anlass: Nutzerfrage in v1.9.41, warum sich die Arenaleiter-/Top-Vier-Sprites in Schwarz/Weiß
nicht bewegen, obwohl Rivalen (Cheren, Bianca, N) und der Cynthia-Cameo animiert sind. Befund
war (siehe Changelog-Backlog-Eintrag "Kein Bug, geprüft"): rein zufällig je nach Recherche-Quelle
pro Sprite, keine Editions-/Rollen-Regel. Diese Runde prüft, ob sich das nachträglich beheben lässt.

## Root Cause

Alle 16 betroffenen Sprites (`Cilan, Chili, Cress, Lenora, Burgh, Elesa, Clay, Skyla, Brycen,
Drayden, Shauntal, Grimsley, Caitlin, Marshal, Ghetsis, Alder`) sind byteidentisch mit der
**Schwarz/Weiß-(BW1)-Version** des jeweiligen Sprites auf Bulbagarden Archives
(`Spr_BW_<Name>.png`) - alle einzelbildrig, 1,4-4,4 KB. Die bereits animierten Sprites (Cheren,
Bianca, N, Cynthia-Cameo) stammen dagegen von der **Schwarz2/Weiß2-(B2W2)-Version**
(`Spr_B2W2_<Name>.png`), die auf Bulbagarden Archives zum jetzigen Zeitpunkt animierte APNGs
sind (Animations-Chunk `acTL` vorhanden, 9-92 KB). Der vorherige Recherche-Durchgang hat also
schlicht zwei unterschiedliche Spiel-Versionen als Quelle gemischt, ohne dass dies beabsichtigt war.

## Prüfmethode

Für jeden der 16 Namen wurde sowohl `Spr_BW_<Name>.png` als auch `Spr_B2W2_<Name>.png` von
`archives.bulbagarden.net` geladen und per Byte-Inspektion auf den `acTL`-Chunk geprüft. Zusätzlich
wurden beide Versionen visuell verglichen (Outfit/Pose), da sich Charaktere zwischen BW1 und B2W2
optisch verändert haben können.

## Ergebnis: 15 von 16 sicher ersetzbar, 1 Ausnahme

| Name | BW1 (aktuell, statisch) | B2W2 (Kandidat) | Outfit identisch? | Aktion |
|---|---|---|---|---|
| Cilan | 1.416 B | 11.176 B, animiert | Ja | Ersetzen |
| Chili | 1.883 B | 23.556 B, animiert | Ja | Ersetzen |
| Cress | 1.813 B | 15.748 B, animiert | Ja | Ersetzen |
| Lenora | 2.112 B | 26.778 B, animiert | Ja | Ersetzen |
| Burgh | 2.066 B | 30.417 B, animiert | Ja | Ersetzen |
| Elesa | 1.731 B | 25.337 B, animiert | Ja (andere Pose, gleiches Outfit) | Ersetzen |
| Clay | 2.405 B | 36.509 B, animiert | Ja | Ersetzen |
| Skyla | 2.115 B | 30.552 B, animiert | Ja | Ersetzen |
| Brycen | 2.518 B | 42.982 B, animiert | Ja | Ersetzen |
| Drayden | 4.111 B | 27.062 B, animiert | Ja | Ersetzen |
| Shauntal | 1.616 B | 9.846 B, animiert | Ja | Ersetzen |
| Grimsley | 4.429 B | 30.960 B, animiert | Ja | Ersetzen |
| Caitlin | 2.848 B | 73.731 B, animiert | Ja | Ersetzen |
| Marshal | 2.601 B | 35.152 B, animiert | Ja | Ersetzen |
| Alder | 2.790 B | 45.480 B, animiert | Ja | Ersetzen |
| **Ghetsis** | 2.882 B | 91.871 B, animiert | **Nein** | **Nicht ersetzen** |

### Ausnahme Ghetsis

Der `ghetsis`-Bosseintrag (`EINALL_BW_BOSSES`, Kampf im Schloss von N, Ass Trikephalo, Lv.&nbsp;54)
bildet die Konfrontation **innerhalb der Schwarz/Weiß-Story** ab - dort trägt Ghetsis noch sein
lila Team-Plasma-Gewand. Das B2W2-Sprite zeigt ihn dagegen in seinem späteren, dunklen
"wahres Gesicht"-Outfit (Mantel, Stock) - ein optisches Redesign, kein bloßes Remake desselben
Bildes. Ein Tausch würde an dieser Story-Stelle das falsche Outfit zeigen und der B2W2-Wendung
vorgreifen. Bleibt daher bewusst beim statischen BW1-Sprite.

## Nebenbefund: Seitenverhältnis

6 der 15 Ersatz-Sprites sind nicht quadratisch (Burgh 91×80, Elesa 93×80, Brycen 80×88,
Grimsley 80×86, Caitlin 85×80, Marshal 80×90 - alle anderen 80×80 wie bisher). Die
`.boss-sprite`-Regel setzt aktuell kein `object-fit`, das `<img>` bekommt aber feste
`width`/`height`-Attribute je Kachel - ohne Gegenmaßnahme würden diese 6 Sprites leicht verzerrt
dargestellt. Fix: `object-fit:contain` zur `.boss-sprite`-Regel ergänzt (gleiches Muster wie
bereits bei `.header-team-slot img` etc.).

## Quelle

`archives.bulbagarden.net`, Dateien `Spr_B2W2_<Name>.png` (offizielle, aus dem ROM exportierte
Kampf-Sprites von Pokémon Schwarz2/Weiß2), gleiche Quelle wie die bereits vorhandenen animierten
Sprites (Cheren, Bianca, N, Cynthia-Cameo).

## Status

Umgesetzt in v1.9.42 (15 Sprites ersetzt, Ghetsis bewusst ausgenommen und im Changelog dokumentiert).

## Ausblick: weitere Generationen

Beim ersten Stichproben-Vergleich (siehe v1.9.41-Backlog-Eintrag) wurde bereits festgestellt, dass
dasselbe Muster (zufällige Quellmischung pro Sprite statt Editions-Regel) auch in anderen
Generationen vorliegt, z.&nbsp;B. Sinnoh (`SnBarry`, `SnMars` statisch, `SnRoark`/`SnGardenia`
bereits animiert). Ein vollständiger Sprite-Konsistenz-Audit über alle Editionen/Generationen ist
als eigener, mehrteiliger Arbeitsschritt geplant (Fortsetzung nach Gen 5 mit Sinnoh/Gen 4).
