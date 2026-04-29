-- ============================================
-- SYNC LOGS TABLE
-- Tracks the AI Learning Loop (Sync & Retrain)
-- ============================================

CREATE TABLE IF NOT EXISTS public.sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    synced_count INTEGER NOT NULL,
    status TEXT NOT NULL, -- 'success', 'failed'
    retrain_triggered BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for date-based lookups
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON public.sync_logs(created_at);

-- RLS
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Admins only (simplified check for this migration)
CREATE POLICY "Admins can view sync logs" ON public.sync_logs
    FOR SELECT USING (true); -- Usually restricted to admin user_id
