# E-Commerce Platform

A full-stack e-commerce application built with **React, Express.js, Prisma, and MySQL**.

The project provides a complete shopping workflow including authentication, product browsing, cart management, checkout, order management, admin functionality, and a production deployment.

## Live Demo

**Frontend:**  
https://e-commerce-psi-lilac-14.vercel.app

**Backend API:**  
https://e-commerce-backend-ccpv.onrender.com

> The application is currently using a simulated payment flow for development and testing. Real payment processing with a provider such as Stripe is planned for a future iteration.

---

## Features

### Customer

- User registration and login
- JWT-based authentication
- Browse products
- Product search and filtering
- Category filtering
- Price filtering
- Pagination
- Product details and image gallery
- Server-side shopping cart
- Stock-aware cart controls
- Checkout
- Shipping information
- Order creation
- Order history
- Order details
- Simulated payment flow
- Payment status tracking

### Admin

- Admin authentication and authorization
- User management
- Change user roles
- Category management
- Product management
- Product image management
- Order management
- Order status transitions
- Dashboard statistics
- Revenue and order metrics

### Backend

- REST API
- Express.js
- Prisma ORM
- MySQL
- JWT authentication
- Password hashing with bcrypt
- Request validation
- Centralized error handling
- Transaction-based order creation
- Stock validation and atomic stock updates
- Decimal-safe money calculations
- Pagination and filtering

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Context API
- Native Fetch API
- CSS

### Backend

- Node.js
- Express.js
- Prisma
- MySQL
- JWT
- bcryptjs

### Deployment

- Vercel — frontend
- Render — backend
- Aiven — MySQL database

---

## Architecture

```text
React Frontend
      |
      | HTTP / REST API
      v
Express Backend
      |
      | Prisma ORM
      v
MySQL Database
```

Production:

```text
Browser
   |
   v
Vercel
React Frontend
   |
   | /api
   v
Render
Express API
   |
   | Prisma
   v
Aiven MySQL
```

---

## Project Structure

```text
e-commerce/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

---

## Database

The application uses **MySQL with Prisma**.

Main entities include:

- User
- Category
- Product
- ProductImage
- Cart
- CartItem
- Order
- OrderItem

The database uses relational constraints and transactions to maintain consistency during checkout.

Order items also store snapshots of product names and prices so that historical orders remain accurate even if the original product changes later.

---

## Authentication

Authentication uses JWT.

The backend provides:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Passwords are hashed using bcrypt before being stored.

The frontend stores only the authentication token and does not store passwords, password hashes, or complete user objects in local storage.

Role-based authorization is used to protect administrative functionality.

---

## Checkout

Checkout is handled on the server.

The backend:

1. Retrieves the user's cart.
2. Validates cart quantities.
3. Retrieves current product prices and stock.
4. Calculates the order subtotal on the server.
5. Creates the order.
6. Creates order items.
7. Decrements product stock.
8. Clears the user's cart.
9. Returns the created order.

These operations are performed inside a Prisma database transaction so that a failed checkout does not leave the database in a partially updated state.

---

## Payments

The current version uses a **simulated payment flow**.

The next planned payment iteration is to integrate a real payment provider and implement:

- Payment creation
- Checkout sessions
- Payment confirmation
- Webhooks
- Webhook signature verification
- Idempotent webhook processing
- Payment failure handling
- Reliable order fulfillment

The application will not treat a frontend success page as proof that a payment was completed. Payment status should ultimately be confirmed by a trusted server-side payment provider event.

---

## Local Development

### Requirements

Make sure you have:

- Node.js
- npm
- MySQL
- Git

### Clone the repository

```bash
git clone https://github.com/Biniam777/e-commerce.git
cd e-commerce
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=5000
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/ecommerce_dev"
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="7d"
```

Run Prisma migrations:

```bash
npm run prisma:migrate
```

Generate Prisma Client:

```bash
npx prisma generate
```

Start the backend:

```bash
npm start
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available through the Vite development server.

---

## Environment Variables

### Backend

```text
PORT
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
```

### Frontend

```text
VITE_API_BASE_URL
```

Secrets should never be committed to Git.

Use `.env.example` to document required environment variables without exposing real credentials.

---

## API

The backend exposes REST endpoints for:

```text
/api/health
/api/auth
/api/products
/api/categories
/api/cart
/api/orders
/api/admin/users
/api/admin/orders
/api/admin/dashboard
```

The API uses JSON responses and centralized error handling.

---

## Security Considerations

The project includes several security practices:

- Password hashing with bcrypt
- JWT authentication
- Role-based authorization
- Server-side authorization checks
- Server-side price calculation
- Server-side stock validation
- No password storage in frontend local storage
- No password hash returned in API responses
- Protected admin routes
- Input validation
- Database transactions for checkout
- Generic production error responses
- Environment variables for secrets

This project is still a learning/portfolio application and should receive additional security review before being used for a high-volume commercial deployment.

---

## Future Improvements

Planned improvements include:

- Real payment provider integration
- Stripe or another region-supported payment provider
- Secure payment webhooks
- Idempotent payment processing
- Email order notifications
- Product reviews and ratings
- Wishlist
- Advanced admin analytics
- Image storage/CDN
- Automated tests
- CI/CD
- Rate limiting
- Monitoring and logging
- Database backups
- Improved production performance

---

## Learning Goals

This project was built to practice and demonstrate full-stack software development concepts including:

- React application architecture
- REST API design
- Express.js
- Relational database design
- Prisma ORM
- Authentication and authorization
- Transactions
- E-commerce business logic
- Inventory management
- Payment architecture
- Production deployment
- Debugging production issues

---

## Author

**Biniam**

GitHub:  
https://github.com/Biniam777

---

## License

This project is intended primarily for learning and portfolio purposes.
