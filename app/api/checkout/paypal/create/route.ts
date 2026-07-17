import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOrder } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Convert ZAR to EUR for PayPal (PayPal does not support ZAR)
    const zarToEurRate = 0.05;
    const totalInEur = parseFloat((order.total * zarToEurRate).toFixed(2));
    const paypalOrder = await createOrder(totalInEur, 'EUR', orderId);

    return NextResponse.json({ paypalOrderId: paypalOrder.id });
  } catch (error: any) {
    console.error('PayPal create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
