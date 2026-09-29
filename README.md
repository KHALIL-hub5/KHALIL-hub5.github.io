# Khalil Djaidja — Portfolio

A responsive, dark-first personal portfolio built with Vite, React, TypeScript, and Tailwind CSS. The site is deployed to GitHub Pages.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). To make and inspect a production build:

```sh
npm run build
npm run preview
```

Run the configured lint checks with `npm run lint`.

## Edit portfolio content

All portfolio copy and editable project, experience, skill, contact, and metadata content lives in [`src/data/content.ts`](./src/data/content.ts). Update that file to change the text, tags, project links, and social links without editing the components.

For a public project repository, set `repoUrl` and `status: 'available'`. For a private repository or one that is not ready to share, set `status: 'private'` or `status: 'coming-soon'`; those states render clear badges instead of placeholder URLs. Add LinkedIn and Upwork URLs to their profile objects when available.

The hero portrait is stored at `public/khalil-profile.png`. Replace that file to use a different image, and update `heroImage.alt` in `src/data/content.ts` to describe it.

The CV button expects a PDF at `public/Khalil_CV.pdf`. Add your CV file there before publishing; the repository intentionally does not contain a fabricated CV.

The color theme is switched with the sun/moon button and saved in browser local storage.

## Project showroom

The Projects section lazy-loads a CSS 3D showroom for KHdamli, MediLink DZ, and ALIAS · UNIVENT. Each product has its own scoped palette, screenshot pickers, project details, and repository status. The desktop stage pairs a browser-screen deck with a phone coverflow; on narrow screens use the Web view/Mobile view buttons to browse the same screens as a compact carousel. The pause control stops motion, and reduced-motion preferences disable it automatically.

Project copy, palettes, labels, emblems, repository information, and screen lists are typed in [`src/data/projects.ts`](./src/data/projects.ts). To add or update a screenshot, update the `SHOTS` data in [`references/Project showroom – 3D preview.html`](./references/Project%20showroom%20%E2%80%93%203D%20preview.html) and run:

```sh
npm run extract:showroom
```

The script writes optimized WebP files under `public/projects/` (web images capped at 1000px wide, mobile images at 480px) and refreshes [`src/data/project-screens.generated.json`](./src/data/project-screens.generated.json). Keep the original aspect ratio and do not crop or recolor screenshots. KHdamli's three web screens are locally rendered concept components in `src/components/showroom/khdamli-web/`; replace them with real screenshots in `src/data/projects.ts` when they are available.

## Deploy to GitHub Pages

The workflow in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) builds and deploys the site whenever a commit is pushed to `main`, or when manually started from GitHub Actions. In the repository settings, configure **Pages → Build and deployment → Source** as **GitHub Actions**.

The Vite base path is `/`, matching this `KHALIL-hub5.github.io` repository.

## TODO before publishing

- Replace the visible `[email]` placeholder in `src/data/content.ts` with a real contact address.
- Add the LinkedIn and Upwork profile URLs in `src/data/content.ts`.
- Replace `[dates]` for each experience entry with the correct dates.
- Add the Gestion Maintenance short description.
- Add the Gestion Maintenance repository URL in place of `[url]`.
- Add the ALIAS and Networking Lab repository URLs in place of `[url]`.
- Add `public/Khalil_CV.pdf` so the Download CV button serves the real CV.
- Confirm the social/contact links and project descriptions before launch.
- Replace the KHdamli web concept screens with real web screenshots when available.
- Confirm the ALIAS · UNIVENT repository link.
- Verify the UNIVENT (web) versus UNIEVENT (mobile sign-in screenshot) spelling.
