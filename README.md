# VOID. — demo e-commerce frontend

Next.js 14 (App Router) · MUI · Tailwind · Bootstrap · three.js (react-three-fiber) · framer-motion · zustand.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Expects the API at `NEXT_PUBLIC_API_URL` (default `http://localhost:5001/api`, see `.env.local`).
If the backend is unreachable the app silently falls back to bundled sample data in `src/lib/data`, so the demo always renders.

## Responsive preview

A floating **Mobile / Tablet / Desktop** switcher (bottom-centre) renders the site inside a phone or tablet frame.
Rotate and reload controls are in the top bar while previewing. The choice is remembered in localStorage.

## Structure

```
src/app                 routes: / , /shop, /product/[slug], /cart, /checkout
src/components/three    HeroScene (floating 3D photo lookbook), ModelViewer (GLB garments), Lights
src/components/device   AppShell, DeviceStage, DeviceToggle (responsive preview)
src/components/product  ProductCard (3D tilt, hover swap), ProductGallery (tilt + zoom), ProductDetail
src/components/shop     ShopClient (filters, sort, search — URL driven)
src/components/cart     CartDrawer, CartPage, CheckoutPage
src/lib                 api.js (fetch + fallback), catalog.js
src/store               cart.js, device.js (zustand, persisted)
```

## Styling conventions

- **Bootstrap** → grid (`row`, `col-*`), forms (`form-control`), tables.
- **Tailwind** → spacing, typography, layout utilities (preflight & `container` disabled to avoid clashing with Bootstrap).
- **MUI** → interactive components (Buttons, Drawer, Chips, Slider, Select, Accordion, Snackbar) via a dark theme.

## Accounts & order history

`/login`, `/signup` and `/account` (profile + order history). The session token is kept in the `void-auth` store; checkout sends it so orders land in the account's history and pre-fills name and email. "Use demo account" signs in as **demo@void.shop / void1234**. If the backend is unreachable, `src/lib/localAccount.js` stands in, keeping accounts and orders in this browser's localStorage.

## Light / dark theme

The sun/moon button in the navbar (and the device-preview toolbar) switches themes; the choice is saved and shared with the preview frame. MUI sets `data-theme` on `<html>`, and `globals.css` defines both palettes as CSS variables that the Tailwind tokens (`void`, `ink`, `bone`, `mute`) read, so `bg-void` / `text-bone` flip automatically. Use `snow` / `night` for text that must stay light or dark in both themes (e.g. on the coloured Men/Women panels or the light 3D stage).

## Product images

Every product is a 3D garment: its page shows only the live viewer, and `public/products/<slug>-3d.jpg` (a 4:5 still render of the model, referenced from the catalogue's `images` field) is used for cards, the cart and the hero.

## 3D garment models

Every product shows the live 3D viewer on a light studio backdrop (`STAGE_BACKDROP` in `src/lib/stage.js`). The 16 products share four models; tinted models (tee, dress) take the selected swatch colour.

| Used for | File | Source (CC BY 4.0) |
| --- | --- | --- |
| All tees | `public/models/tshirt.glb` | "Tshirt" by Tabbuso |
| All hoodies | `public/models/hoodie.glb` | "Classic Black Flame Hoodie" by kril |
| All jackets | `public/models/jacket.glb` | "JACKET" by ypushkar30 |
| All dresses | `public/models/dress.glb` | "Dress" by Titaniyaa |

Credits are shown in the footer and on the viewer, as the licence requires.
Originals (~87 MB) are kept in `models-src/` (git-ignored). The web copies were made with:

```bash
npx @gltf-transform/cli optimize models-src/<in>.glb public/models/<out>.glb \
  --compress meshopt --texture-compress webp --texture-size 1024 --simplify-ratio <0.08–1>
```

The dress's base-colour texture (a cutting-pattern layout, not fabric) was stripped so it can be tinted.
`model.tint: true` recolours the fabric to the selected swatch; `false` keeps the model's textures and shows `model.colorway`.
