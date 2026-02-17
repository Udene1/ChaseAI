# ChaseAI Architecture – Hybrid AI for Reminders

## Core Components
- **Main App**: Next.js (App Router) + Supabase + Vercel
- **AI Microservice**: Python FastAPI + scikit-learn/Prophet + separate Supabase + Vercel
- **LLM Providers**: Groq / OpenAI / Gemini / xAI (via `lib/ai.ts`)

## Reminder Generation (Hybrid)
1. **Trigger**: `/api/reminders/generate/[id]` or automated cron.
2. **Fetch signals**: Call microservice endpoints `predict-behavior`, `optimize-timing`, `extract-industry`.
3. **Build enriched prompt**: Inject ML signals into the system prompt for the LLM.
4. **Call LLM**: Generate the final personalized message using the enriched context.
5. **Store & send**: Persist the generated message and send via the selected channel.

## Learning Loop
- **Outcome tracking**: When invoices are marked as paid, the `paid_at` and `payment_status` are updated.
- **Sync**: A daily cron job pushes anonymized invoice/payment deltas to the microservice `/api/sync-data` endpoint.
- **Retrain**: The microservice triggers retraining (`/api/train-models`) on the accumulated data.
- **Improvement cycle**: Over time, predictions for risk and optimal timing become more accurate, leading to better collection rates.

## Data Privacy
- **Anonymization**: Only hashed `client_id`, amounts, dates, and sanitized descriptions are sent to the microservice.
- **No PII**: No names, emails, or phone numbers are shared with the microservice, complying with basic privacy principles.

## Future Scalability & Migration
ChaseAI is designed to be platform-agnostic for easy scaling:
- **Containerization**: The AI Service includes a `Dockerfile` and `docker-compose.yml`, allowing it to run on AWS (ECS/EKS), Google Cloud, Render, or DigitalOcean.
- **Twelve-Factor App**: Configuration is strictly managed via environment variables.
- **Decoupled Database**: The AI microservice uses its own Supabase project, which can be migrated to a standalone Postgres/PostGIS instance if needed.
- **Portability**: A `Procfile` is included for rapid deployment to PaaS providers like Render or Railway.
