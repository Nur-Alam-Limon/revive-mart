
# Revive Mart 🛒 - (SecondHand Marketplace for Buying & Selling Used Items)

This is the backend server for the **SecondHand Marketplace Web Application**, where users can buy and sell used items. It is built using **TypeScript**, **Express.js**, and **MongoDB**. The platform allows users to post listings for used items, browse available products, and communicate securely with sellers.

**Live Link** - https://revive-mart-backend.vercel.app

## Features

- **User Authentication**: Custom login system using email and password. JWT for secure authentication and password hashing with bcrypt.
- **User Dashboard**: Users can manage their listings, view purchase and sales history, and manage their profile.
- **Listings & Search**: Users can create, update, and delete listings. Search and filter functionality based on categories, price, and condition.
- **Admin Panel**: Admin features for managing users and listings.
- **Transactions & Order Management**: Users can track and manage purchases and sales.

## API Routes

### 1. **Authentication**

#### 1.1. Register a New User
- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```

#### 1.2. Login User
- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```

#### 1.3. Logout User
- **Endpoint**: `/auth/logout`
- **Method**: `POST`

### 2. **Listings Management**

#### 2.1. Get All Listings
- **Endpoint**: `/listings`
- **Method**: `GET`

#### 2.2. Get a Specific Listing
- **Endpoint**: `/listings/:id`
- **Method**: `GET`

#### 2.3. Create a New Listing
- **Endpoint**: `/listings`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "title": "Used Laptop",
    "description": "A slightly used laptop in good condition.",
    "price": 500,
    "condition": "used",
    "images": ["image1.jpg", "image2.jpg"],
    "category": "Electronics",
    "userID": "user123"
  }
  ```

#### 2.4. Update a Listing
- **Endpoint**: `/listings/:id`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "price": 450,
    "condition": "like new"
  }
  ```

#### 2.5. Delete a Listing
- **Endpoint**: `/listings/:id`
- **Method**: `DELETE`

### 3. **User Management**

#### 3.1. Get User Profile
- **Endpoint**: `/users/:id`
- **Method**: `GET`

#### 3.2. Update User Profile
- **Endpoint**: `/users/:id`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "newemail@example.com"
  }
  ```

#### 3.3. Delete User Account
- **Endpoint**: `/users/:id`
- **Method**: `DELETE`

### 4. **Transactions**

#### 4.1. Create a Transaction (Purchase)
- **Endpoint**: `/transactions`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "buyerID": "buyer123",
    "sellerID": "seller456",
    "itemID": "item789",
    "status": "pending"
  }
  ```

#### 4.2. Update Transaction Status
- **Endpoint**: `/transactions/:id`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "status": "completed"
  }
  ```

### 5. **Messaging System (Optional)**

#### 5.1. Send a Message
- **Endpoint**: `/messages`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "senderID": "user123",
    "receiverID": "seller456",
    "message": "Is this item still available?"
  }
  ```

#### 5.2. Get User Messages
- **Endpoint**: `/messages/:userId`
- **Method**: `GET`

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/secondhand-marketplace-backend.git
   cd secondhand-marketplace-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and configure the following:
   ```
   PORT=3000
   MONGO_URI=mongodb://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
   JWT_SECRET=your-jwt-secret
   ```

---

## Scripts

- **Start Development Server**:

  ```bash
  npm run start:dev
  ```

  Runs the server using `ts-node-dev`.

- **Build for Production**:

  ```bash
  npm run build
  ```

  Compiles the TypeScript code to JavaScript.

- **Start Production Server**:

  ```bash
  npm run start:prod
  ```

  Runs the production build.

- **Lint Code**:

  ```bash
  npm run lint
  ```

- **Format Code**:

  ```bash
  npm run prettier
  ```

---

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Language**: TypeScript
- **Authentication**: JWT, bcrypt

---

## Author

[Nur Alam Chowdhury](https://github.com/Nur-Alam-Limon)
```