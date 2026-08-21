# Delicious Food 🍽️

A full-stack restaurant management and food ordering platform built with React and Node.js. Supports three roles — Super Admin, Restaurant Owner, and Customer — with real-time order tracking via WebSockets.

## Tech Stack

**Frontend** — React 19, Vite, Tailwind CSS, Framer Motion, Socket.io Client

**Backend** — Express 5, Mongoose (MongoDB), Socket.io, Cloudinary, JWT Auth, Swagger

**Database** — MongoDB Atlas

## Features

### Customer
- Browse and search restaurants
- View menus, add items to cart, and place orders
- Track order status in real time
- Make table reservations
- Manage favorites and view offers
- Update profile and settings

### Restaurant Owner
- Dashboard with revenue and order stats
- Menu and category management (CRUD)
- Order management with status updates
- Reservation management
- Customer insights and reports

### Super Admin
- Approve or reject restaurant registrations
- Manage all restaurants, users, and orders
- Platform-wide analytics and reports
- System settings

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone the repo
git clone https://github.com/h-ivan2/deliciousFood.git
cd deliciousFood
```

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Seed the database (optional):

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000` and Swagger docs at `http://localhost:5000/api-docs`.

### Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@delicious.com | admin1234 |
| Owner | sarah@greenbowl.com | owner1234 |
| Customer | james@gmail.com | customer1234 |

## Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── config/        # DB, Cloudinary, Swagger config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, error handling, uploads
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API route definitions
│   │   ├── app.js         # Express server entry
│   │   └── seed.js        # Database seeder
│   └── .env
├── Frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context (Cart, Theme)
│   │   ├── pages/         # Page components by role
│   │   ├── services/      # API service layer
│   │   └── App.jsx        # Router and routes
│   └── .env
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Get current user |
| GET | `/api/v1/restaurants` | List approved restaurants |
| GET | `/api/v1/menu/items/:id` | Get menu items |
| POST | `/api/v1/orders` | Place an order |
| PATCH | `/api/v1/orders/:id/status` | Update order status |
| POST | `/api/v1/reservations` | Create a reservation |
| GET | `/api/v1/admin/stats` | Admin dashboard stats |

Full API documentation available at `/api-docs` when the server is running.

## License

ISC
