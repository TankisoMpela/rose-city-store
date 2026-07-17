-- Drop the select policy on orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Re-create it with support for guest users (user_id IS NULL)
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Drop the select policy on order_items
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;

-- Re-create it to support viewing items of guest orders
CREATE POLICY "Users can view their order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );
