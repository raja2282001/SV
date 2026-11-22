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
```

Keep `.env` private and never use temporary development credentials in production. Configure `API_PORT` and `DATA_FILE` to change the API port or data file location.

## API

All routes use `/api/v1`.

- Public: `GET /products`, `GET /products/:slug`, `GET /categories`, `GET /categories/:slug`, `GET /services`, `GET /settings/public`, `POST /contact`
- Admin: `POST /admin/login`, product create/update/archive, category create/update, `GET /admin/enquiries`, enquiry status updates, service updates, and business settings updates

Pass the login token as `Authorization: Bearer <token>` for admin routes. Product listing accepts `search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, and `limit` query parameters. Contact submissions and login attempts are rate-limited.

## Checks

```sh
npm run lint
npm run build
```
