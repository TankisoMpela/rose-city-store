-- Drop the insert policy on orders
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;

-- Re-create it with explicit support for guest checkout (user_id IS NULL)
CREATE POLICY "Users can insert their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
