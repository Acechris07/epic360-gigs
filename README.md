# Epic360 Gigs - Freelance Platform

A modern freelance platform built with Next.js, React, TypeScript, and Supabase, featuring real-time messaging, payment processing, and comprehensive gig management.

## 🚀 Features

- **User Authentication**: Secure signup/login with email verification
- **Gig Management**: Create, browse, and manage freelance gigs
- **Real-time Messaging**: Built-in chat system for client-freelancer communication
- **Payment Processing**: Stripe integration for secure payments
- **Category System**: 20+ service categories including Cooking and Decor
- **Search & Filtering**: Advanced search with category and price filters
- **Email Notifications**: Automated email system using Resend
- **Rate Limiting**: API protection with Upstash Redis
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Stripe
- **Email**: Resend
- **Rate Limiting**: Upstash Redis
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Supabase account
- Stripe account (for payments)
- Resend account (for emails)
- Upstash Redis account (for rate limiting)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/epic360-gigs.git
cd epic360-gigs
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Security
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 4. Set up the database
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the contents of `scripts/setup-database.sql`

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── browse/            # Browse services page
│   ├── categories/        # Category pages
│   ├── create-gig/        # Create gig page
│   ├── create-service/    # Create service page
│   ├── dashboard/         # User dashboard
│   ├── messages/          # Messaging system
│   ├── orders/            # Order management
│   └── search/            # Search functionality
├── components/            # Reusable React components
│   ├── ui/               # Shadcn/UI components
│   └── ...               # Custom components
├── lib/                   # Utility functions and configurations
├── scripts/               # Database setup and utilities
└── public/                # Static assets
```

## 🎯 Key Features Explained

### Authentication System
- Email/password authentication with Supabase Auth
- Email verification flow
- Password reset functionality
- Protected routes and API endpoints

### Gig Management
- Create and manage gig listings
- Category-based organization
- Image upload support
- Pricing and delivery time management

### Real-time Messaging
- WebSocket-based chat system
- Message notifications
- Conversation management
- File sharing support

### Payment Processing
- Stripe integration for secure payments
- Webhook handling for payment status updates
- Order management system
- Escrow functionality

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the database setup script
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers

### Stripe Setup
1. Create a Stripe account
2. Get your API keys
3. Configure webhook endpoints
4. Test payment flows

### Email Setup (Resend)
1. Create a Resend account
2. Verify your domain
3. Get your API key
4. Configure email templates

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/epic360-gigs/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🗺️ Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] AI-powered gig recommendations
- [ ] Video calling integration
- [ ] Multi-language support
- [ ] Advanced dispute resolution system

---

Built with ❤️ using Next.js, React, and Supabase
