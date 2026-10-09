# E-commerce Backend

Production-oriented REST API for the e-commerce application.

## Stack

- Node.js
- Express 5
- JavaScript
- MySQL 8
- Prisma ORM
- JWT authentication
- bcryptjs password hashing
- Helmet security headers

## Requirements

- Node.js 20 or newer
- npm
- MySQL 8 or compatible MySQL server

## Features

- User registration and login
- JWT authentication
- Role-based admin authorization
- User profile and session handling
- Category management
- Product management
- Product images
- Server-side shopping cart
- Stock validation
- Checkout and order creation
- Customer order history
- Simulated payment flow
- Admin dashboard
- Admin user management
- Admin order management
- Order status transition rules
- Payment-before-delivery protection
- Centralized error handling
- Request body size limits
- Security headers with Helmet
- Environment validation
- Explicit JWT algorithm validation

## Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md