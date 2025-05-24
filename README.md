# Digital Menu Application

A scalable Digital Menu Application built with NestJS backend and Next.js frontend, containerized with Docker for easy development and deployment.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ddfadela/digital-menu-frontend.git
cd digital-menu-frontend
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

### 3. Quick Start with Docker

```bash
docker-compose up -d --build
```

The application will be available at:

- **Frontend**: `http://localhost:3000`

### 4. Manual Setup (Without Docker)

```bash
npm install

npm run start
```

## Application Flow

### 1. Admin Panel

Access the admin dashboard at:

http://localhost:3000/admin
Register or login as an admin.

### 2. Create and Manage Restaurant

After logging in, the admin can:

- Create one or more restaurants
- Add menu categories (e.g., Starters, Mains, Desserts)
- Add dishes under each category

### 3. View QR Code

Once a restaurant is created, a QR code is generated and can be viewed at:

http://localhost:3000/qr/:restaurantId
Scanning the QR code redirects the user to:
Scanning the QR code redirects the user to:
http://localhost:3000/:restaurantId

### 4. Customer Experience

Customers access the digital menu via the QR code:

- Browse categories and dishes
- Place orders directly from the menu page

### 5. Real-Time Order Notifications

Admins receive:

- Instant WebSocket-based notifications for each new pending order
- Notifications appear in the admin dashboard for real-time order management

### 4. Customer Experience

Customers access the digital menu via the QR code:

- Browse categories and dishes
- Place orders directly from the menu page
- View order history with status tracking
- For completed orders:
  - Rate the experience (1-5 stars)
  - Add comments/feedback
  - Vote for favorite dishes from their orders

### 5. Real-Time Order Notifications

Admins receive:

- Instant WebSocket-based notifications for each new pending order
- Notifications appear in the admin dashboard for real-time order management
- Aggregated customer feedback and ratings
- Popular dishes based on customer votes

### 6. Feedback System

- Customers can review their past orders whe he see his orders that is accepted
