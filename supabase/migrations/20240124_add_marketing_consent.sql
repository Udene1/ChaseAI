-- Add marketing_opt_in field to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN DEFAULT false;

-- Update the handle_new_user function to carry over the preference from auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, marketing_opt_in)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE((NEW.raw_user_meta_data->>'marketing_opt_in')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
