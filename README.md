# ShopSphere Backend API

A Node.js/Express backend API for an e-commerce platform with user authentication, product management, and order processing.

## Features

- **User Authentication**: JWT-based auth with registration, login, and profile management
- **Product Management**: CRUD operations for products with admin controls
- **Order Processing**: Order creation, status tracking, and inventory management
- **Admin Panel**: Protected admin routes for managing products and orders
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- Morgan (logging)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopsphere-B
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/shopsphere
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=4000
   SEED_PRODUCTS=true
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - Get all active products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders/checkout` - Create new order
- `GET /api/orders` - Get orders (user sees own, admin sees all)
- `GET /api/orders/my` - Get current user's orders

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,
  role: String (default: 'customer')
}
```

### Product
```javascript
{
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  category: String,
  stock: Number,
  isActive: Boolean
}
```

### Order
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    priceAtPurchase: Number
  }],
  total: Number,
  status: String (pending/paid/shipped/delivered/cancelled)
}
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Admin Setup

To create an admin user, run:
```bash
node setup-admin.js
```

Or manually set a user's role to 'admin' in the database.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | 'dev_secret' |
| `PORT` | Server port | 4000 |
| `SEED_PRODUCTS` | Auto-seed sample products | true |

## Development

The server includes:
- CORS enabled for all origins
- Request logging with Morgan
- Error handling middleware
- Automatic product seeding on startup

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper MongoDB connection string
4. Set `SEED_PRODUCTS=false` to disable seeding
5. Use PM2 or similar for process management

## Troubleshooting

- **Database Connection Issues**: Check MongoDB is running and `MONGO_URI` is correct
- **Authentication Errors**: Verify JWT_SECRET is set and tokens are valid
- **CORS Issues**: Ensure frontend URL is allowed in CORS settings
- **Product Not Showing**: Check if `isActive` field is set to true

## API Response Format

### Success Response
```json
{
  "data": {...},
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error description",
  "status": 400
}
```

## License

MIT License