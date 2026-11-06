# MediNest

MediNest is a full-stack online pharmacy and everyday health store demo. Customers can browse health products, manage a cart, and place delivery orders. Administrators can manage products, inventory, orders, users, and prescription requests.

> **Project scope:** This is a demonstration project, not a medical service or a production-ready pharmacy. Product listings and prices are sample data. Checkout records payment-at-delivery choices; it does not process online payments.

## Features

- Browse products by category and search the catalog.
- View product details, prices, and stock availability.
- Manage a cart and wishlist.
- Create an account, sign in, and manage delivery addresses.
- Place orders and view order history.
- Upload and review prescription requests for products that require them.
- Administer products, stock, users, orders, and prescription requests.
- Save refill reminders in the browser.

## Technology

- **Frontend:** React 19 and Vite
- **Backend:** Node.js and Express 5
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Other backend services:** bcryptjs for password hashing and Nodemailer for email

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- A MongoDB instance, local or hosted

## Run locally

1. Clone the repository and open its directory:

   ```sh
   git clone <repository-url>
   cd MediNest-Project
   ```

2. Install dependencies for the root scripts and both applications:

   ```sh
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. Configure the backend. Create `backend/.env` with your MongoDB connection string and a private JWT secret:

   ```dotenv
   MONGODB_URI=mongodb://127.0.0.1:27017/medinest
   JWT_SECRET=replace-with-a-long-random-secret
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   ```

   `MONGODB_URI` can be replaced with your hosted MongoDB connection string. The backend also accepts `MONGO_URL` as an alternative. Keep `.env` files and secrets out of Git.

   Email settings are optional for running the store, but email-related account flows need a working SMTP configuration. Add these to `backend/.env` when needed:

   ```dotenv
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-email-app-password
   MAIL_FROM=your-email@example.com
   ```

4. Configure the frontend environment file. Copy the provided example:

   **PowerShell**
   ```powershell
   Copy-Item frontend\.env.example frontend\.env
   ```

   **macOS/Linux**
   ```sh
   cp frontend/.env.example frontend/.env
   ```

   The example points the frontend to `http://localhost:5000/api`. Set `VITE_API_URL` in `frontend/.env` if your backend uses a different address.

5. Start the frontend and backend from the project root:

   ```sh
   npm run dev
   ```

   The frontend is served at `http://localhost:5173` and the API at `http://localhost:5000`.

## Optional: load demo products

With MongoDB configured in `backend/.env`, run:

```sh
npm run seed:demo-products --prefix backend
```

## Useful commands

Run these from the project root:

```sh
npm run dev
npm run build --prefix frontend
npm run lint --prefix frontend
```

## Project structure

```text
MediNest-Project/
├── backend/       # Express API, MongoDB models, routes, and services
├── frontend/      # React and Vite application
├── package.json   # Root development command
└── README.md
```

## Payments and data

The available checkout choices represent payment at delivery (such as Cash on Delivery). No online payment gateway is integrated. Demo product names, descriptions, prices, and stock are illustrative and should not be treated as verified retail or medical information.
