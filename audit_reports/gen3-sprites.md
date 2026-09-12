# Sprite-Konsistenz-Audit: Hoenn (Gen 3, Teil 3)

Fortsetzung des mit Gen 5 (`gen5-sprites.md`) und Gen 4 (`gen4-sprites.md`) begonnenen
generationsübergreifenden Sprite-Konsistenz-Audits. Betroffene Editionen: Rubin/Saphir, Smaragd
(ORAS nutzt bereits den modernen Pokémon-Masters-EX-Chibi-Stil aus v1.9.6 und ist hier nicht
betroffen, bis auf eine Ausnahme siehe unten).

## Root Cause - anders als bei Gen 4/5

Rubin/Saphir/Smaragd sind Game-Boy-Advance-Spiele. Der GBA hatte technisch keine animierten
Kampf-Trainer-Sprites - das Feature kam erst mit Nintendo DS ab bestimmten Titeln. Für Hoenn
existiert also **kein** direktes "Original-Edition vs. verbesserte Version"-Muster wie bei
Diamant/Perl→Platin oder Schwarz/Weiß→Schwarz2/Weiß2. Stattdessen wurde geprüft, ob Bulbagarden
Archives einen **späteren Gastauftritt** desselben Charakters mit echter Animation führt - das
Pokémon World Tournament (PWT) in Schwarz2/Weiß2 lässt genau das zu: dort treten u.&nbsp;a. frühere
Arenaleiter aus anderen Regionen mit neu gezeichneten, animierten Sprites im selben Look wie ihr
Original an.

## Ergebnis: 7 von 26 geprüften statischen Sprites sicher ersetzbar

37 Bosssprites in der App sind insgesamt noch statisch, davon 26 aus Rubin/Saphir/Smaragd. Für
jeden wurde geprüft, ob unter `Spr_B2W2_<Name>.png` auf Bulbagarden Archives ein animiertes PWT-
Gegenstück existiert, und falls ja, ob Outfit/Design mit dem Original übereinstimmt.

| Name (Sprite-Key) | Rolle | PWT-Sprite vorhanden? | Outfit identisch? | Aktion |
|---|---|---|---|---|
| Roxanne (`SmRoxanne`) | Arenaleiterin | Ja, animiert | Ja | **Ersetzen** |
| Flannery (`SmFlannery`) | Arenaleiterin | Ja, animiert | Ja | **Ersetzen** |
| Brawly (`SmBrawly`) | Arenaleiter | Ja, animiert | Ja | **Ersetzen** |
| Norman (`SmNorman`) | Arenaleiter | Ja, animiert | Ja | **Ersetzen** |
| Winona (`SmWinona`) | Arenaleiterin | Ja, animiert | Ja | **Ersetzen** |
| Wattson (`SmWattson`) | Arenaleiter | Ja, animiert | Ja | **Ersetzen** |
| Steven (`RSSteven`) | Champion (Rubin/Saphir) | Ja, animiert | Ja | **Ersetzen** |
| Wallace (`SmWassili`) | Arenaleiter UND Champion (Smaragd, ein gemeinsamer Sprite-Key für beide Rollen) | Ja, animiert - zeigt aber sein **Champion-Gewand**, nicht die Arenaleiter-Kluft | Nein (rollenabhängig) | **Nicht ersetzen** |
| Juan (`SmJuan`) | Arenaleiter | Ja, animiert | Unklar - PWT-Bild wirkt in der kleinen Vorschau deutlich abweichend (älter/andere Pose), ließ sich nicht zweifelsfrei als dieselbe Kluft verifizieren | **Zurückgestellt**, nicht ersetzt |
| Tate & Liza (`SmTateLiza`, `OrTateLiza`) | Arenaleiter-Duo | Ja, aber als zwei **einzelne** Sprites (Tate, Liza getrennt) statt eines gemeinsamen Doppelkampf-Bildes | - | **Zurückgestellt** - bräuchte Code-Änderung (zwei Sprites nebeneinander statt einem), kein reiner Datentausch |
| Wally, Phoebe, Drake, Shelly, Archie, Glacia, Sidney, Maxie, Tabitha, Courtney, Matt | Arenaleiter/Top&nbsp;Vier/Team-Bosse | **Nein** - keine PWT-Version auf Bulbagarden Archives verfügbar | - | Bleiben statisch, kein Fix möglich |

## Nebenbefund: Wallace-Sprite wird für zwei unterschiedliche Rollen wiederverwendet

`SmWassili` dient in Smaragd sowohl der Arenaleiter-Begegnung in Xeneroville (Lv.&nbsp;43, blaue
Arenaleiter-Kluft im Original) als auch dem späteren Champion-Kampf (Lv.&nbsp;58, weißes Champion-
Gewand im Original) - beide Bosseinträge referenzieren denselben Sprite-Key. Schon jetzt zeigt die
App an beiden Stellen dieselbe (Arenaleiter-)Kluft, der Champion-Kampf ist also bereits mit dem
"falschen" Outfit hinterlegt - das ist aber ein bestehender Datengenauigkeits-Punkt, unabhängig von
dieser Animations-Runde, und wird hier nur dokumentiert, nicht behoben (bräuchte einen zweiten,
eigenen Sprite-Key für die Champion-Rolle plus Codeanpassung).

## Nebenbefund: Rivale "Blau" nutzt HeartGold/SoulSilver-Artwork statt jugendlichem Rot/Blau-Look

Beim Untersuchen von Kanto (Rot/Blau/Gelb) fiel auf, dass der Sprite-Key `Blue` (Rivale Blau, u.&nbsp;a.
`rival0` bei Lv.&nbsp;5 direkt nach der Starterwahl) byteidentisch mit `Spr_HGSS_Blue.png` ist - dem
**erwachsenen Arenaleiter-Blau aus HeartGold/SoulSilver** (Generation&nbsp;4), nicht seinem jugendlichen
Rivalen-Design aus der Roten/Blauen Edition selbst. Optisch ein deutlicher Unterschied (u.&nbsp;a. andere
Kleidung, älteres Gesicht). Dieselbe Sprite-Datei wird auch für den späteren Vertania-City-Arenaleiter-
Kampf verwendet (dort baseLevel&nbsp;60 - dort ist das erwachsene Design tatsächlich passend). Reine
Bild-Genauigkeitsfrage, keine Animationsfrage - hier nicht behoben, nur dokumentiert für eine mögliche
spätere Korrekturrunde.

## Quelle

`archives.bulbagarden.net`, Dateien `Spr_B2W2_<Name>.png` (Pokémon World Tournament-Gastauftritte in
Schwarz2/Weiß2).

## Status

7 Sprites in v1.9.44 ersetzt. Wallace/Juan/Tate&Liza bewusst zurückgestellt (siehe Tabelle),
11 weitere Hoenn-Bosse bleiben mangels verfügbarer Quelle dauerhaft statisch.
