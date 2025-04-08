# FX Trading App Backend
This is the backend implementation of an FX Trading App, built as part of a backend engineering assessment. The application allows users to register, verify their email, fund their wallets, perform currency conversions, and trade Naira (NGN) with other international currencies (e.g., USD, EUR) using real-time FX rates.

# Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Key Assumptions](#key-assumptions)
- [API Documentation](#api-documentation)
  
The FX Trading App backend enables users to:

Register and verify their email using a one-time password (OTP).
Fund their wallet with Naira (NGN) and hold balances in multiple currencies (e.g., NGN, USD, EUR).
Convert and trade Naira with other currencies using real-time FX rates fetched from a third-party API.
View their transaction history, including funding, conversions, and trades.
The system ensures secure currency conversion, wallet management, and real-time FX rate integration while adhering to best practices for scalability, security, and performance.

# Tech Stack
Backend Framework: NestJS
Package Manager: Yarn
ORM: TypeORM
Database: PostgreSQL
Mail Provider: Gmail SMTP (for sending OTP emails)
FX Rate API: exchangerate-api.com (for fetching real-time FX rates)
Caching: NestJS cache-manager (for storing FX rates temporarily, as a bonus feature)
Setup Instructions
Follow these steps to set up and run the project locally.

# Prerequisites
Node.js (v16 or higher)
Yarn (v1.22 or higher)
PostgreSQL (v13 or higher)
Gmail account (for SMTP email sending)
Installation
Clone the Repository
git clone https://github.com/your-username/fx-trading-app.git
cd fx-trading-app
Install Dependencies

yarn install
Set Up Environment Variables Create a .env file in the root directory and add the following variables:
env

# Database Configuration

DATABASE_HOST=localhost

DATABASE_PORT=5432

DATABASE_USER=your_postgres_user

DATABASE_PASSWORD=your_postgres_password

DATABASE_NAME=fx_trading_app

# FX Rate API Configuration

FX_API_KEY=your_exchangerate_api_key

# JWT Secret for Authentication

JWT_SECRET=your_jwt_secret

Set Up the Database

Ensure PostgreSQL is running.

Create a database named fx_trading_app.

Run migrations to set up the database schema:

yarn typeorm migration:run
Start the Application

yarn start:dev

# Key Assumptions

Wallet Balances: Each user has a wallet with balances stored in multiple currencies (NGN, USD, EUR, etc.) in a single table with a JSONB column to handle currency balances dynamically.

FX Rates: Rates are fetched from the exchangerate-api.com API and cached using NestJS cache-manager for 5 minutes to improve performance.

Email Verification: OTPs are sent via Gmail SMTP and are valid for 10 minutes.

Transaction Atomicity: Database transactions are used to ensure atomicity during wallet funding, conversions, and trades to prevent double-spending or inconsistent balances.

Scalability: The system is designed to handle additional currencies by dynamically fetching supported currencies from the FX API.

# API Documentation
The following API endpoints are implemented as per the assessment requirements. You can use tools like Postman to interact with the API.

# Base URL
http://localhost:3000

# Endpoints
Method	Endpoint	Description
POST	/auth/register	Register a user and trigger OTP email

POST	/auth/verify	Verify OTP and activate account

GET	/wallet	Get user wallet balances by currency

POST	/wallet/fund	Fund wallet in NGN or other currencies

POST	/wallet/convert	Convert between currencies using real-time FX rates

POST	/wallet/trade	Trade Naira with other currencies and vice versa

GET	/fx/rates	Retrieve current FX rates for supported currency pairs

GET	/transactions	View transaction history

# Architectural Decisions

Modular Structure: The application follows NestJS's modular architecture, with separate modules for authentication, wallet management, FX rates, and transactions.

Database Design: A users table stores user information, a wallets table stores balances in a JSONB column (e.g., {"NGN": 1000, "USD": 2.5}), 
and a transactions table logs all activities (funding, conversions, trades).

Caching: NestJS cache-manager is used to cache FX rates for 5 minutes to reduce API calls and improve performance.

Security: JWT is used for authentication, and input validation is handled using NestJS pipes and DTOs to prevent invalid data.

Error Handling: Custom exception filters are implemented to handle external API failures (e.g., rate fetch failures) gracefully, with retries and fallback mechanisms.

