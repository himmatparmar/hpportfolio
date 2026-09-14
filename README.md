# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Editing content with the CMS

Work experience, education, banner text, contact text, skills, softwares, certificates, and events start out as seed data in `src/data/*.json`, bundled into the site so it always has content to show. Live edits are served from **Netlify Blobs** via Netlify Functions in `netlify/functions/`, so the deployed site always renders the latest saved version (falling back to the bundled seed for anything never edited).

To edit content, open **`/admin.html`** on the deployed site (e.g. `https://your-site.netlify.app/admin.html`), enter the admin password, edit, and save — changes go live within moments, no rebuild needed.

**One-time setup after deploying:** in the Netlify dashboard, go to **Site settings → Environment variables** and add `CMS_ADMIN_PASSWORD` with the password you want to gate the admin panel with, then trigger a redeploy. Without it, `/admin.html` can still be viewed but all saves are rejected.

Running `npm run dev` locally serves the site and `/admin.html` too, but Netlify Functions aren't available under plain Vite — pages fall back to the bundled seed data, and admin saves will fail. To test the full round-trip locally, install the Netlify CLI and run `netlify dev` instead, which serves the functions alongside Vite.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
