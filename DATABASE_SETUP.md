# Database Setup Guide

## Setting up Supabase Database

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `zhifxamtdygbufbzwgvu`

### Step 2: Run the Database Schema
1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `scripts/setup-database.sql`
4. Paste it into the SQL editor
5. Click **"Run"** to execute the script

### Step 3: Verify Setup
After running the script, verify these tables were created:
- `profiles`
- `gigs`
- `services`
- `orders`
- `reviews`
- `messages`
- `favorites`
- `categories`

### Step 4: Test Database Connection
Run your Next.js application and test:
1. User registration
2. Profile creation
3. Order creation
4. File uploads

### Step 5: Storage Setup
1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `uploads`
3. Set the bucket to public
4. Configure CORS policies if needed

## Troubleshooting

### Common Issues:
1. **Permission Errors**: Make sure RLS policies are working correctly
2. **Connection Issues**: Verify your environment variables
3. **Storage Errors**: Check bucket permissions and CORS settings

### Testing Commands:
```bash
# Test the application
npm run dev

# Check for any TypeScript errors
npm run build
```

## Next Steps After Database Setup:
1. Implement payment system with Stripe
2. Add messaging functionality
3. Create user dashboards
4. Set up email notifications 