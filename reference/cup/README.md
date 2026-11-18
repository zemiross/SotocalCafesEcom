# Cup reference

The client's cup mockup arrived on 29/10/2026 with the Drive materials: `Sotocal Espresso Cup.pdf` (4 pages), rendered here as `cup-mockup-p1.png` … `p4.png`.

| Page | Shows |
|---|---|
| 1 | Side A: inner-wall lettering "Orgulhosamente Português" (low) and "¿Português?" (high) |
| 2 | Side B: website and arrow |
| 3 | Base decal: "1960", "Shop online here", arrow, QR code |
| 4 | Reveal levels as coffee is drunk: 100 % = 20.7 mm, 75 % = 16.3 mm, 50 % = 11.5 mm, 25 % = 6.1 mm above the inner base; lettering cap height ≤ 2.6 mm |

How the theme uses it (DECISIONS D05, D06, D47):
- Generator: `scripts/build-cup.mjs`. Geometry constants are in millimetres at the top of the file: wall radius r(h) = 19 + 11·h/47, ellipse ratio ry/rx = 0.848, view tilt cos 58° = 0.53. The lettering arcs (`cupArcLow` at 12.4 mm, `cupArcHigh` at 17.4 mm) sit between the mockup's 50 % and 100 % levels, so a full cup covers both lines and they appear as it empties.
- Output: `snippets/cup-svg.liquid` (inline SVG; `state: 'full' | 'empty'`), animated by `assets/cup.js`, which reads the same constants from the SVG's `data-geom` attribute.
- Differences from the mockup: the screen fills to 36 mm (`FULL_H`), above the mockup's 20.7 mm "100 %" band, and the crema shows a coffee bean (client, 30/10/2026; D57); no "¿" (a mistake in the mockup, confirmed by the client on 29/10/2026; the printed cup's artwork needs the same fix), and no QR code on screen (unscannable at that size).
- To refit: change the constants, run `node scripts/build-cup.mjs`, then `npm run prototype` and compare with `cup-mockup-p4.png`. "75 %" in the mockup means coffee left after drinking; the site fills 0 → 100 %.
