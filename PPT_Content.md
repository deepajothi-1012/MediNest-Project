# MediNest — Project Presentation Content

Slide-ready content for a project presentation. Replace the presenter and institution placeholders on Slide 1 before presenting. The notes under each slide can be used as speaker notes.

---

## Slide 1 — MediNest

**Online Pharmacy and Everyday Health Store**

- Project: MediNest
- Presented by: [Your name]
- Course / institution: [Course or institution]
- Date: [Presentation date]

**Speaker notes:**
MediNest is a web application for browsing medicines and everyday health products, managing a shopping cart, and placing delivery orders. This presentation introduces the problem, the solution, the main features, and the technology used to build it.

**Visual suggestion:** Use the MediNest logo or storefront home page as the background image.

---

## Slide 2 — The Problem

- Customers need a convenient way to browse medicines and common health products.
- Product information and categories can be difficult to navigate in a basic online store.
- Customers need a simple path from product discovery to cart and order placement.
- Pharmacy teams need tools to manage products, inventory, orders, and prescription requests.

**Speaker notes:**
MediNest addresses these needs with one storefront for both customers and administrators. The goal is to make the shopping flow clear while giving administrators access to the data and actions needed to manage the catalog and orders.

---

## Slide 3 — The MediNest Solution

- A category-based storefront for medicines and health products.
- Product search, product details, stock information, and pricing.
- Cart, wishlist, saved addresses, and order history.
- Prescription upload and review workflow for products marked as requiring a prescription.
- Admin tools for catalog, inventory, user, order, and prescription management.

**Speaker notes:**
The customer-facing store and the administrator tools use the same application and backend. Customers can browse and order; authorized administrators can manage the store’s operational data.

---

## Slide 4 — Product Categories

- Medicines
- Vitamins
- Health products and wellness
- Personal care and baby products
- Herbal products
- Health tools and devices
- Oral care and hair care

**Speaker notes:**
Categories help customers browse a broad catalog. The project includes demo catalog data for these categories. The demo listings, prices, stock values, and product descriptions are illustrative and should be verified before a real store uses them.

**Visual suggestion:** Show the category navigation and a few product cards from different categories.

---

## Slide 5 — Customer Shopping Journey

1. Browse categories or search for a product.
2. Review product details, price, and stock availability.
3. Add products to the cart or save them to the wishlist.
4. Sign in and select or enter a delivery address.
5. Choose a payment method at delivery and place the order.
6. Review order history or reorder previous items.

**Speaker notes:**
The frontend keeps the shopping flow in one web application. Some pages, such as the cart and order history, are selected through URL query parameters. Authentication is required for account-specific actions such as checkout.

---

## Slide 6 — Prescription and Account Features

- Sign up, sign in, and password reset.
- JWT-based authenticated requests.
- Saved customer profiles and delivery addresses.
- Prescription upload associated with a product.
- Prescription review states: pending, approved, or rejected.
- Refill reminders saved in the browser.

**Speaker notes:**
The application supports a prescription workflow for products flagged as prescription-required. A customer can upload a supported file, and an administrator can review the request. Refill reminders are stored in browser local storage, so they are tied to that browser rather than being synced as server-side reminders.

---

## Slide 7 — Administrator Features

- Add, update, activate, and deactivate product listings.
- Review inventory and stock levels.
- View users and orders.
- Update order status.
- Review submitted prescriptions.

**Speaker notes:**
Administrative actions are protected by role-based backend middleware. This separates customer actions from management actions and keeps privileged API endpoints available only to administrators.

---

## Slide 8 — System Architecture

```text
Customer / Admin browser
          |
          | React UI and API requests
          v
Express REST API
          |
          | Mongoose models and queries
          v
MongoDB database
```

- **Frontend:** React application served and built with Vite.
- **Backend:** Node.js and Express REST API.
- **Database:** MongoDB accessed through Mongoose.
- **Authentication:** JWT tokens attached to protected API requests.

**Speaker notes:**
The browser renders the user interface and sends HTTP requests to the backend. Express routes requests to controllers and services. Services use Mongoose models to read and update MongoDB data. The backend is configured to connect to the database before it starts listening for requests.

---

## Slide 9 — Main Data Models

- **User:** account details, role, and saved addresses.
- **Product:** name, brand, category, price, stock, and prescription flag.
- **Cart:** products and quantities selected by a customer.
- **Order:** purchased items, delivery address, payment method, and order status.
- **Prescription:** uploaded file metadata and review status.
- **OTP:** one-time codes used in account flows.

**Speaker notes:**
The data models define the structure and validation rules for the application’s main records. Orders store a snapshot of item names and prices so the order remains understandable even if a product listing changes later.

---

## Slide 10 — Technology Stack

| Area | Technology |
|---|---|
| UI | React |
| Development server and build | Vite |
| API | Node.js and Express |
| Database and object modeling | MongoDB and Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password hashing | bcryptjs |
| Email | Nodemailer |

**Speaker notes:**
React and Vite are used for the browser application. The backend uses Express routes and services, with MongoDB accessed through Mongoose. JWTs protect authenticated routes, bcryptjs hashes passwords, and Nodemailer supports email-related account flows.

---

## Slide 11 — Payments and Current Scope

- Checkout supports Cash on Delivery.
- UPI at delivery and card at delivery can be selected and saved with an order.
- The application does not currently collect online payments through a payment gateway.
- Demo catalog products and prices are sample data, not verified retail listings.

**Speaker notes:**
Payment choices currently describe how payment is intended to be collected at delivery. The project does not integrate an online payment provider, so it should not be presented as processing UPI or card payments online. A production deployment would need a payment gateway integration and verified product and regulatory information.

---

## Slide 12 — Future Enhancements and Conclusion

**Possible future enhancements**

- Integrate a payment gateway for online payments.
- Add delivery tracking and customer notifications.
- Improve product administration with image uploads and stronger catalog validation.
- Add reporting for sales, stock, and order trends.
- Expand automated testing and deployment workflows.

**Conclusion**

MediNest brings product discovery, cart and order management, prescription handling, and administrator tools together in one web application.

**Speaker notes:**
MediNest demonstrates a full-stack e-commerce workflow tailored to a pharmacy and health-products catalog. The current version provides a foundation that can be extended with payment processing, delivery integrations, and production-ready catalog data.

---

## Optional Demo Walkthrough

1. Open the home page and browse a product category.
2. Search for a product and open its product card.
3. Add a product to the cart and sign in.
4. Enter or select a delivery address.
5. Select a payment-at-delivery option and place a demo order.
6. Open order history to show the saved order.
7. If using an administrator account, show inventory and prescription review tools.
