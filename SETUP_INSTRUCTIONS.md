# Quick Start Guide

## Running the Application

### Terminal 1 - Backend
\`\`\`bash
cd backend
python manage.py runserver
\`\`\`

### Terminal 2 - Frontend
\`\`\`bash
npm run dev
\`\`\`

### Access the Application
- **Customer App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Django Admin**: http://localhost:8000/admin

## First Time Setup

1. **Backend Setup**
   \`\`\`bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py seed_menu
   python manage.py runserver
   \`\`\`

2. **Frontend Setup**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

3. **Test the Application**
   - Open http://localhost:3000
   - Browse menu items
   - Add items to cart
   - Proceed to checkout
   - Track order

## Key Files

### Frontend
- `app/menu/page.jsx` - Menu browsing
- `app/checkout/page.jsx` - Order creation
- `app/payment/page.jsx` - Payment processing
- `app/track/[orderId]/page.jsx` - Order tracking
- `app/admin/page.jsx` - Admin dashboard
- `lib/api-client.js` - API client utility

### Backend
- `backend/canteen/models.py` - Database models
- `backend/canteen/views.py` - API endpoints
- `backend/canteen/serializers.py` - Data serialization
- `backend/config/settings.py` - Django configuration

## Environment Variables

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

### Backend (backend/config/settings.py)
- `DEBUG = True` (development)
- `ALLOWED_HOSTS = ['*']` (development)
- `CORS_ALLOWED_ORIGINS` includes localhost:3000

## Common Commands

### Backend
\`\`\`bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed menu data
python manage.py seed_menu

# Run server
python manage.py runserver

# Access Django admin
# http://localhost:8000/admin
\`\`\`

### Frontend
\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
