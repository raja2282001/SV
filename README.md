# S V Copiers / Xerox Catalogue

Responsive React catalogue frontend and Express REST API for product browsing, printing services, business information, and customer enquiries. The site does not provide carts, checkout, payments, or product ordering.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

Install dependencies:

```sh
npm install
```

Start the API in one terminal:

```sh
npm run dev:server
```

Start the Vite app in another terminal:

```sh
npm run dev
```

Open `http://localhost:3000`. Vite proxies `/api` requests to the API on port `3001`.

Without `MONGODB_URI`, the API persists development data to `data/catalogue.json`. Set `MONGODB_URI` to use MongoDB/Mongoose instead. The catalogue starts with no products and no categories; add confirmed inventory through the admin API rather than publishing sample prices as real stock. Printing services are listed without prices until an administrator configures them. Public business settings include the supplied address and confirmed closing time only; phone, email, and opening hours are blank until configured.

When no admin password is configured, the API generates a temporary development password and prints it to the server terminal at startup. Set the following values in a local `.env` file for a stable admin login and token signing key:

```dotenv
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-with-a-strong-private-password
ADMIN_TOKEN_SECRET=replace-with-a-long-random-secret
MONGODB_URI=mongodb://127.0.0.1:27017/sv_copiers
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
```

Keep `.env` private and never use temporary development credentials in production. Configure `API_PORT` and `DATA_FILE` to change the API port or data file location.
The admin product and category forms upload JPEG, PNG, WebP, and GIF images (up to 5 MB) through the authenticated API to the ImageKit `/products` and `/categories` folders, respectively. Configure `IMAGEKIT_PRIVATE_KEY` on the API server; the private key is never sent to the browser. ImageKit uploads fail with a configuration error until this value is set.

## API

All routes use `/api/v1`.

- Public: `GET /products`, `GET /products/:slug`, `GET /categories`, `GET /categories/:slug`, `GET /services`, `GET /settings/public`, `POST /contact`
- Admin: `POST /admin/login`, product create/update/archive, category create/update/delete, `GET /admin/enquiries`, enquiry status updates, service updates, and business settings updates

Pass the login token as `Authorization: Bearer <token>` for admin routes. Product listing accepts `search`, `category`, `brand`, `availability`, `isAvailable`, `minPrice`, `maxPrice`, `sort`, `page`, and `limit` query parameters; category, brand, and availability filters may be repeated or comma-separated. A category linked to products cannot be deleted. Contact submissions and login attempts are rate-limited.

## Checks

```sh
npm run lint
npm run build
```

## Deploy frontend and API together on Render

This repository can run as one Render **Web Service**. The build creates `dist/`;
the Express server serves that frontend and the `/api/v1` API from the same
origin. The browser uses `/api/v1` by default, so no database or admin secret is
exposed to frontend code.

1. Create a Render Web Service from this repository and select the `main`
   branch.
2. Set the build command to `npm ci && npm run build`.
3. Set the start command to `npm run start:server`.
4. In Render's Environment settings, set `MONGODB_URI`, `ADMIN_USERNAME`,
   `ADMIN_PASSWORD`, and `ADMIN_TOKEN_SECRET`. Do not commit these values or put
   them in a `VITE_` variable. Render supplies `PORT` automatically.
5. In MongoDB Atlas, allow network access from the Render service and ensure the
   database user in `MONGODB_URI` has access to the application database.
6. Deploy, then check `https://YOUR-SERVICE.onrender.com/api/v1/health`. The
   homepage is served at the service root; product, contact, and admin actions
   use the API on the same origin.

## Deploy frontend and API together on Vercel

The Vercel Function in `api/[...path].ts` routes API requests to the Express
application. Vercel invokes it on demand, so MongoDB must be configured; the
local JSON-file fallback is disabled there.

1. Create a MongoDB Atlas database and database user, and configure its network
   access to accept connections from your Vercel deployment.
2. Import this repository into Vercel with the repository root as the project
   root. Select the Vite preset, set the install command to `npm ci`, the build
   command to `npm run build`, and the output directory to `dist`. Do not use
   `npm run start:server` as an install or build command.
3. Add `MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and
   `ADMIN_TOKEN_SECRET` in the Vercel project's Environment Variables. Add
   `IMAGEKIT_PRIVATE_KEY` if product or category image uploads are used.
   `VITE_API_BASE_URL` can remain `/api/v1`.
4. Deploy and verify `https://YOUR-DEPLOYMENT.vercel.app/api/v1/health`.

For local development, set `VITE_API_BASE_URL=/api/v1` (the default) and run
`npm run dev:server` and `npm run dev` in separate terminals. Vite proxies
`/api` to the local API. Keep the frontend and API on the same origin in
production; a separately hosted frontend requires explicit API CORS support
and a restricted origin allowlist.
