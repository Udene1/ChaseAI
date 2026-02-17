# ChaseAI - AI-Powered Invoice Management
 - AI-Powered Invoice Chaser

An AI-powered invoice reminder SaaS for freelancers and small businesses. Automate late payment reminders with intelligent, personalized messages that get you paid faster.

## AI & Reminder Architecture (Hybrid LLM + ML Microservice)

ChaseAI employs a **Hybrid Intelligent System** to maximize collection rates for freelancers.

### How it Works:
1.  **Structured Predictions**: A specialized Python ML microservice analyzes historical payment data to predict risk scores and optimal reminder timing.
2.  **Enriched Prompts**: These ML signals are injected into our LLM prompts (Groq/OpenAI).
3.  **Natural Generation**: The LLM uses this data to write highly personalized, data-aware reminder messages.
4.  **Learning Loop**: As invoices are paid, the main app pushes anonymized outcomes back to the ML service, allowing the models to retrain and improve over time.

For more details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

![ChaseAI Dashboard](./docs/dashboard-preview.png)

## Features

- 🤖 **AI-Powered Personalization** - Smart messages adapted to each client's payment history
- 📧 **Multi-Channel Reminders** - Send via Email, SMS, or WhatsApp
- ⚡ **Automated Scheduling** - Set it and forget it with escalating reminders
- 📊 **Insightful Reports** - Track payment trends with AI-powered insights
- 🇳🇬 **Nigeria-Friendly** - Full NGN currency support and WhatsApp integration
- 🔒 **Secure & Private** - Bank-grade security with Supabase RLS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Email/Password + Google OAuth)
- **Payments**: Stripe (Subscriptions + One-time payments)
- **AI**: Groq or OpenAI for message personalization
- **Email**: Resend (or Nodemailer/SendGrid)
- **SMS/WhatsApp**: Twilio
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner toast

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- Groq or OpenAI API key
- (Optional) Twilio account for SMS/WhatsApp
- (Optional) Resend account for email

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/chaseai.git
cd chaseai
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema:
   ```sql
   -- Copy contents from supabase/schema.sql
   ```
3. Enable Google OAuth (optional):
   - Go to Authentication > Providers > Google
   - Add your Google OAuth credentials
4. Create storage bucket:
   - Go to Storage > Create new bucket
   - Name: `invoices`
   - Public: No
   - Max file size: 10MB
   - Allowed MIME types: `application/pdf`

### 3. Set Up Stripe

1. Create products and prices in Stripe Dashboard:
   - Monthly subscription: $19/month
   - Lifetime deal: $199 one-time
2. Note the Price IDs (start with `price_`)
3. Set up webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.paid`

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_LIFETIME=price_...

# AI (choose one)
GROQ_API_KEY=gsk_...
# or
OPENAI_API_KEY=sk-...
AI_PROVIDER=groq

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=invoices@yourdomain.com

# SMS/WhatsApp (optional)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-random-secret-string
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. (Optional) Seed Sample Data

```bash
npm run seed
```

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!

The `vercel.json` includes cron configuration for daily reminder checks at 9 AM UTC.

### Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your production domain
2. Add production webhook URL to Stripe
3. Verify email domain in Resend/SendGrid
4. Test the complete flow

## Project Structure

```
chaseai/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API routes
│   ├── auth/callback/       # OAuth callback
│   ├── pricing/             # Pricing page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── invoice/             # Invoice-related components
│   ├── layout/              # Sidebar, Header
│   ├── reminder/            # Reminder modal
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── ai.ts                # AI integration (Groq/OpenAI)
│   ├── email.ts             # Email sending
│   ├── sms.ts               # SMS/WhatsApp via Twilio
│   ├── stripe.ts            # Stripe utilities
│   ├── templates.ts         # Email/SMS templates
│   └── utils.ts             # Utility functions
├── types/                   # TypeScript types
├── supabase/
│   └── schema.sql           # Database schema
├── scripts/
│   └── seed.ts              # Seed script
└── public/                  # Static assets
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/invoices` | GET, POST | List/Create invoices |
| `/api/invoices/[id]` | GET, PUT, DELETE | Single invoice operations |
| `/api/reminders/generate/[id]` | POST | Generate AI reminder |
| `/api/reminders/send/[id]` | POST | Send reminder |
| `/api/cron/check-reminders` | POST | Daily cron job |
| `/api/upload` | POST | Upload PDF |
| `/api/webhooks/stripe` | POST | Stripe webhooks |
| `/api/stripe/checkout` | POST | Create checkout session |
| `/api/stripe/portal` | POST | Customer portal session |
| `/api/reports/insights` | POST | Generate AI insights |

## Customization

### Adding New Currency

Edit `lib/utils.ts`:
```typescript
const locales: Record<Currency, string> = {
  NGN: 'en-NG',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  // Add more...
};
```

### Modifying Email Templates

Edit `lib/templates.ts` to customize the reminder email HTML.

### Changing AI Model

Edit `lib/ai.ts`:
```typescript
// For Groq
model: 'llama-3.1-70b-versatile'

// For OpenAI
model: 'gpt-4o-mini'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use for your own projects!

## Support

- 📧 Email: support@chaseai.app
- 💬 Discord: [Join our community](#)
- 📖 Docs: [docs.chaseai.app](#)

---

Built with ❤️ for freelancers everywhere. Get paid faster with ChaseAI!
