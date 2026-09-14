# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Editing content with the CMS

Work experience, education, banner text, contact text, skills, softwares, certificates, and events all live in `src/data/*.json`. Instead of editing those files by hand, run:

```bash
npm run cms
```

This starts the site (http://localhost:5173) and a local API (http://localhost:4000) together. Open **http://localhost:5173/admin.html** to edit content through a form UI — saving writes straight to the JSON files, and image uploads (Skills tab) land in `public/uploads/`. Refresh the main site to see changes. The admin page is local-only and is not included in `npm run build`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
