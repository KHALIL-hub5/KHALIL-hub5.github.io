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
