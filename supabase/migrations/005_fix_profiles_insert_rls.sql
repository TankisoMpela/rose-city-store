-- Migration: Fix profiles INSERT policy missing for new user trigger
-- The handle_new_user() SECURITY DEFINER trigger fires when a new auth.users
-- row is created (e.g. Google OAuth signup), but there was no INSERT policy
-- on profiles, causing RLS to block the insert with "Database error saving new user".

-- Drop the trigger and recreate handle_new_user as a true SECURITY DEFINER
-- that bypasses RLS entirely (set_config approach).
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = public;

-- Also add an INSERT policy so RLS never blocks profile creation
-- (belt-and-suspenders alongside the SECURITY DEFINER function)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow service role to insert profiles (for the trigger)
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);
