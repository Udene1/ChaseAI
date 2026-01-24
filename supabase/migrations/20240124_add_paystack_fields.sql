-- Add Paystack payment fields to invoices table
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS paystack_payment_url TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS paystack_reference TEXT;

-- Index for payment reference lookups
CREATE INDEX IF NOT EXISTS idx_invoices_paystack_reference ON public.invoices(paystack_reference);
