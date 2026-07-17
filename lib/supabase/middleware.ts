import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function isDemoMode(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    .trim()
    .replace(/\\n/g, '')
    .replace(/\n/g, '');

  // Demo mode if URL is missing, placeholder, or not a valid supabase URL
  const isValidSupabaseUrl = url.startsWith('https://') && url.includes('.supabase.co');
  return !isValidSupabaseUrl;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // In demo mode, skip all auth checks and allow everything
  if (isDemoMode()) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const res = request.cookies.set(name, value);
              if (res instanceof Promise) {
                res.catch(() => {});
              }
            });
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              const res = supabaseResponse.cookies.set(name, value, options);
              if (res instanceof Promise) {
                res.catch(() => {});
              }
            });
          } catch (e) {
            // Ignore cookie set errors in middleware context
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Protect account routes
  if (request.nextUrl.pathname.startsWith('/account')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── Portfolio Entry Gate ──────────────────────────────────────────────────
  // Redirect unauthenticated first-time visitors to /login when they land on
  // the storefront. After they sign in OR click "Browse as guest", a cookie
  // (rcb_seen) is set so they won't be redirected again during this session.
  const storePaths = ['/', '/products', '/product', '/cart', '/checkout'];
  const isStorePath = storePaths.some(
    (p) =>
      request.nextUrl.pathname === p ||
      request.nextUrl.pathname.startsWith(p + '/')
  );
  const isAuthPath =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/forgot-password');

  if (!user && isStorePath && !isAuthPath) {
    const hasSeen = request.cookies.get('rcb_seen');
    if (!hasSeen) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      const redirect = NextResponse.redirect(url);
      // Set a session cookie so they only hit the gate once per browser session
      redirect.cookies.set('rcb_seen', '1', { path: '/', sameSite: 'lax' });
      return redirect;
    }
  }

  return supabaseResponse;
}
