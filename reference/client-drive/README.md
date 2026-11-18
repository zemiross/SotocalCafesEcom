# Client Drive materials (received 29/10/2026)

Source: the client's shared Drive folder "Sotocal" (Branding, Produtos, Taças). Originals are copied unchanged into `originals/`.

| File | What it is | Used for |
|---|---|---|
| `originals/Cores Pantone SOTOCAL.pdf` | Brand colour sheet: **PANTONE 1545 C** (1, dark brown; process C0 M51 Y100 K83) and **PANTONE 466 C** (2, cream; process C11.5 M23.5 Y43 K0), plus the one-colour ("preto") logo | Confirms the theme's locked `--ink` and `--cream` tokens (`assets/base.css`) |
| `originals/Sotocal - Logotipo.ai` | Vector logo (FreeHand 9 / Illustrator PostScript, 09/04/2002). Declares Pant. 466 C = RGB 0.99/0.94/0.80 (#FCF0CC) and Pant. 1545 C = RGB 0.133/0/0 (#220000) | Converted with `scripts/ai-to-svg.mjs` → `assets/logo-sotocal.svg` (with "Est.1960"), `assets/logo-sotocal-emblem.svg` (oval only, used in the header and footer), `logo-sotocal-mono.svg` here (one colour) |
| `originals/LOGO SOTOCAL.bmp` | 63 × 43 px bitmap logo | Not used (too small) |
| `originals/chavena café Sotocal.jpg` | Photo: espresso pouring into a white Sotocal-branded cup, 1000 × 370 | `assets/photo-chavena-sotocal.webp` on the Profissional page |
| `originals/sotocal desdobrável.pdf` | Product leaflet (2 pages): blends, substitutes, accompaniments, conservas, spices, values, contacts | Product texts and compositions in `store-setup/products.json` (via `store-setup/apply-leaflet.py`); see `docs/CONTENT.md` §"Client leaflet" |
| `../cup/Sotocal Espresso Cup.pdf` | Cup mockup (4 pages): side A lettering, side B website + arrow, base decal with QR, reveal levels | The on-screen cup (`scripts/build-cup.mjs`) now follows its reveal bands and lettering proportions |

`leaflet-images/` holds the leaflet's embedded images (packshots and photos, max ≈ 1000 px; alpha masks removed). Two of them became theme assets: `p1-x19…` → `assets/photo-torrefacao.webp` (green coffee sacks and an antique grinder, História) and `p1-x15…` → `assets/photo-cafeeiro.webp` (coffee cherries, A torra). All the photos are Sotocal's own, and Sotocal confirmed its rights to use them on the web (29/10/2026).

`cup-render-empty-900.png` and `header-logo-render.png` are renders of the theme after these changes, for comparison with the originals.
