# Smart Canteen Ordering System - Integration Guide

## Overview
This guide explains how to run the complete Smart Canteen Ordering System with both frontend and backend integrated.

## Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- pip (Python package manager)

## Backend Setup

### 1. Install Dependencies
\`\`\`bash
cd backend
pip install -r requirements.txt
\`\`\`

### 2. Run Migrations
\`\`\`bash
python manage.py migrate
\`\`\`

### 3. Create Superuser (Optional - for Django Admin)
\`\`\`bash
python manage.py createsuperuser
\`\`\`

### 4. Seed Menu Data
\`\`\`bash
python manage.py seed_menu
\`\`\`

### 5. Start Backend Server
\`\`\`bash
python manage.py runserver
\`\`\`

The backend will run at `http://localhost:8000`

## Frontend Setup

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables
The `.env.local` file is already configured with:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

If your backend runs on a different URL, update this variable.

### 3. Start Frontend Development Server
\`\`\`bash
npm run dev
\`\`\`

The frontend will run at `http://localhost:3000`

## API Endpoints

### Menu Items
- `GET /api/menu-items/` - Get all menu items
- `GET /api/menu-items/?category=breakfast` - Get items by category
- `GET /api/menu-items/available/` - Get available items
- `POST /api/menu-items/` - Create menu item (Admin)
- `PATCH /api/menu-items/{id}/` - Update menu item (Admin)
- `DELETE /api/menu-items/{id}/` - Delete menu item (Admin)

### Orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{order_id}/` - Get order details
- `GET /api/orders/{order_id}/track/` - Track order status
- `PATCH /api/orders/{order_id}/update_status/` - Update order status (Admin)
- `GET /api/orders/by_table/?table_number=5` - Get orders by table

### Payments
- `POST /api/payments/process_payment/` - Process payment
- `GET /api/payments/by_order/?order_id=1` - Get payment by order

### Admin
- `GET /api/admin/dashboard/` - Get dashboard statistics
- `GET /api/admin/orders/` - Get all orders
- `GET /api/admin/menu-stats/` - Get menu statistics

## Features

### Customer Features
1. **Browse Menu** - View all menu items by category
2. **Search & Filter** - Search items and filter by price
3. **Shopping Cart** - Add/remove items, adjust quantities
4. **Checkout** - Enter details and select payment method
5. **Payment** - Pay via card or UPI
6. **Order Tracking** - Real-time order status updates

### Admin Features
1. **Dashboard** - View statistics and recent orders
2. **Menu Management** - Add, edit, delete menu items
3. **Order Management** - Update order status
4. **Payment Tracking** - View revenue and payment details

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure:
1. Backend is running on `http://localhost:8000`
2. Frontend is running on `http://localhost:3000`
3. CORS is enabled in `backend/config/settings.py`

### API Connection Issues
1. Check if backend server is running: `python manage.py runserver`
2. Verify API URL in `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
3. Check browser console for detailed error messages

### Database Issues
1. Run migrations: `python manage.py migrate`
2. Seed data: `python manage.py seed_menu`
3. Check database file: `backend/db.sqlite3`

## Production Deployment

### Backend (Django)
1. Set `DEBUG = False` in `settings.py`
2. Update `ALLOWED_HOSTS` with your domain
3. Use a production database (PostgreSQL recommended)
4. Use a production WSGI server (Gunicorn)
5. Set up HTTPS/SSL

### Frontend (Next.js)
1. Build: `npm run build`
2. Deploy to Vercel or your hosting provider
3. Update `NEXT_PUBLIC_API_URL` to production backend URL

## Support
For issues or questions, check the error messages in:
- Browser console (Frontend errors)
- Terminal output (Backend errors)
- Network tab in DevTools (API calls)
