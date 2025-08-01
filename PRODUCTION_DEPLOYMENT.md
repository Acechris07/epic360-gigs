# Production Deployment Guide

## 🚀 Pre-Launch Checklist

### 1. Database Setup (CRITICAL)

```sql
-- Run this in your Supabase SQL Editor
-- Copy the entire contents of scripts/01-create-tables.sql
-- This creates all necessary tables and triggers
```

### 2. Environment Variables Setup

#### Required Services:

- **Domain**: Purchase a domain (e.g., epic360gigs.com)
- **Email**: Sign up at [resend.com](https://resend.com)
- **Payments**: Set up Stripe live account
- **Rate Limiting**: Sign up at [upstash.com](https://upstash.com)

#### Production Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zhifxamtdygbufbzwgvu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Stripe Live Keys (REQUIRED)
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Service (REQUIRED)
RESEND_API_KEY=re_your_actual_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# Rate Limiting (RECOMMENDED)
UPSTASH_REDIS_REST_URL=https://your-upstash-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Security (REQUIRED)
NEXTAUTH_SECRET=your_secure_nextauth_secret_key
NEXTAUTH_URL=https://your-domain.com
```

### 3. Hosting Platform Setup

#### Option A: Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Option B: Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

#### Option C: Railway

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### 4. Domain Configuration

#### DNS Records:

```
A     @     your-server-ip
CNAME www   your-domain.com
```

#### SSL Certificate:

- Most hosting platforms provide automatic SSL
- Ensure HTTPS is enforced

### 5. Email Verification Setup

#### Resend.com Configuration:

1. Verify your domain
2. Add DNS records:
   ```
   TXT    @    v=spf1 include:_spf.resend.com ~all
   CNAME  _resend  _resend.resend.com
   ```
3. Test email sending

### 6. Payment Processing Setup

#### Stripe Live Configuration:

1. Switch from test to live mode
2. Configure webhooks:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Test with real payment methods

### 7. Security Measures

#### Generate Secure Secrets:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate other secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Rate Limiting:

- Set up Upstash Redis for production rate limiting
- Configure appropriate limits for your use case

### 8. Testing Checklist

#### Before Going Live:

- [ ] Database tables created and working
- [ ] User registration and login working
- [ ] Email verification working
- [ ] Payment processing working
- [ ] Search functionality working
- [ ] All pages loading correctly
- [ ] Mobile responsiveness tested
- [ ] SSL certificate active
- [ ] Environment variables configured
- [ ] Test pages removed or protected

### 9. Monitoring Setup

#### Recommended Tools:

- **Vercel Analytics**: Built-in with Vercel
- **Sentry**: Error tracking
- **Google Analytics**: User tracking
- **Uptime Robot**: Uptime monitoring

### 10. Launch Steps

1. **Final Testing**: Test all functionality in staging
2. **DNS Update**: Point domain to hosting platform
3. **SSL Verification**: Ensure HTTPS is working
4. **Payment Testing**: Test with real payment methods
5. **Email Testing**: Verify all email functionality
6. **Go Live**: Announce your platform

### 11. Post-Launch Monitoring

#### Monitor These Metrics:

- User registrations
- Payment success rates
- Email delivery rates
- Page load times
- Error rates
- Server uptime

#### Common Issues to Watch:

- Database connection errors
- Payment processing failures
- Email delivery issues
- Rate limiting problems
- Authentication errors

## 🆘 Troubleshooting

### Database Issues:

- Check Supabase dashboard for connection status
- Verify RLS policies are correctly configured
- Test database queries in Supabase SQL editor

### Payment Issues:

- Check Stripe dashboard for failed payments
- Verify webhook endpoints are accessible
- Test with Stripe's test mode first

### Email Issues:

- Check Resend dashboard for delivery status
- Verify domain DNS records
- Test email templates

### Performance Issues:

- Monitor Vercel/Netlify analytics
- Check database query performance
- Optimize images and assets

## 📞 Support

For issues with:

- **Supabase**: Check their documentation and community
- **Stripe**: Contact Stripe support
- **Resend**: Contact Resend support
- **Vercel**: Check Vercel documentation
- **Next.js**: Check Next.js documentation

## 🔄 Maintenance

### Regular Tasks:

- Monitor error logs
- Update dependencies
- Backup database
- Review security settings
- Monitor performance metrics
- Update SSL certificates
- Review and update privacy policy/terms
