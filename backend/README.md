# FinBuddy Backend API

Production-ready backend API for FinBuddy financial management application with MongoDB Atlas integration.

## Features

- ✅ Industry-standard authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting and security headers
- ✅ MongoDB Atlas integration
- ✅ Role-based access control
- ✅ Secure cookie handling

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/finbuddy?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (or use existing)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<cluster>` in your `.env` file
6. Add your IP address to the IP Whitelist (or use 0.0.0.0/0 for development)

### 4. Start the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/updateprofile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890"
}
```

#### Update Password
```http
PUT /api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

#### Logout
```http
GET /api/auth/logout
Authorization: Bearer <token>
```

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token generation with expiration
- **HTTP-only Cookies**: Prevents XSS attacks
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers
- **Input Validation**: Express-validator for all inputs
- **CORS**: Configured for frontend origin

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js             # JWT verification
│   └── validation.js       # Input validation rules
├── models/
│   └── User.js             # User schema
├── routes/
│   └── auth.js             # Authentication routes
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── server.js               # Main server file
```

## Testing

You can test the API using:
- **Postman**: Import the endpoints above
- **cURL**: Command line testing
- **Frontend**: Connect your React app

Example cURL request:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## Next Steps

- [ ] Add transaction management endpoints
- [ ] Add payment method endpoints
- [ ] Add analytics endpoints
- [ ] Implement email verification
- [ ] Add password reset functionality
