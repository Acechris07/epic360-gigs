# Stripe Setup Guide

## Step 1: Create Stripe Account

1. **Sign up for Stripe**:
   - Go to [https://stripe.com](https://stripe.com)
   - Click "Start now" and create an account
   - Complete the verification process (business details, bank account, etc.)

2. **Verify your account**:
   - Add your business information
   - Verify your identity
   - Add a bank account for payouts

## Step 2: Get Your API Keys

1. **Access API Keys**:
   - In your Stripe Dashboard, go to **Developers** → **API keys**
   - Make sure you're in **Test mode** (toggle in the top right)

2. **Copy your keys**:
   - **Publishable key**: Starts with `pk_test_` (for frontend)
   - **Secret key**: Starts with `sk_test_` (for backend)
   - Keep these secure and never commit them to version control

## Step 3: Update Environment Variables

Replace the placeholder values in your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 4: Set Up Webhooks

1. **Create Webhook Endpoint**:
   - In Stripe Dashboard, go to **Developers** → **Webhooks**
   - Click **"Add endpoint"**
   - Set endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
   - For local development, use a tool like ngrok or Stripe CLI

2. **Select Events**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

3. **Get Webhook Secret**:
   - After creating the webhook, click on it
   - Copy the **Signing secret** (starts with `whsec_`)
   - Add it to your `STRIPE_WEBHOOK_SECRET` environment variable

## Step 5: Test the Integration

1. **Test Payment Flow**:
   - Use Stripe's test card numbers:
     - Success: `4242 4242 4242 4242`
     - Decline: `4000 0000 0000 0002`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)

2. **Test Webhooks**:
   - Use Stripe CLI to test webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## Step 6: Production Setup

1. **Switch to Live Mode**:
   - In Stripe Dashboard, toggle to **Live mode**
   - Get your live API keys
   - Update environment variables with live keys

2. **Update Webhook URL**:
   - Change webhook endpoint to your production domain
   - Update `STRIPE_WEBHOOK_SECRET` with the new signing secret

3. **Set up Payouts**:
   - Configure payout schedule in Stripe Dashboard
   - Set up automatic payouts for freelancers

## Step 7: Security Best Practices

1. **Never expose secret keys**:
   - Keep `STRIPE_SECRET_KEY` server-side only
   - Only use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in frontend

2. **Validate webhook signatures**:
   - Always verify webhook signatures
   - Use the webhook secret to verify authenticity

3. **Handle errors gracefully**:
   - Implement proper error handling
   - Log payment failures for debugging

## Step 8: Testing Commands

```bash
# Test the payment system
npm run dev

# Check if Stripe is configured
curl http://localhost:3000/api/test-stripe

# Test payment creation
curl -X POST http://localhost:3000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{"orderId":"test-order-id","amount":1000}'
```

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**:
   - Check that your API keys are correct
   - Ensure you're using test keys for development

2. **Webhook not receiving events**:
   - Verify webhook URL is accessible
   - Check webhook secret is correct
   - Use Stripe CLI for local testing

3. **Payment fails**:
   - Check browser console for errors
   - Verify Stripe Elements is loaded correctly
   - Test with Stripe's test card numbers

### Support Resources:

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://community.stripe.com)

## Next Steps

After setting up Stripe:

1. Test the complete payment flow
2. Set up freelancer payouts
3. Implement dispute handling
4. Add payment analytics
5. Set up recurring payments (if needed) 