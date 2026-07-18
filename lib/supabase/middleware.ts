import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;

  const isAuthPath =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/forgot-password');

  const isProtectedAdminOrAccount =
    pathname.startsWith('/dashboard') || pathname.startsWith('/account');

  const isStorePath =
    pathname === '/' ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/product/') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout');

  // ── Portfolio Entry Gate (INSTANT — no network call) ──────────────────────
  // Check if a Supabase session cookie exists locally as a fast heuristic.
  // Cookie name format: sb-<project-ref>-auth-token
  const hasSupabaseSession = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token') && c.value.length > 10
  );
  const hasSeen = request.cookies.get('rcb_seen');

  if (!hasSupabaseSession && !hasSeen && isStorePath && !isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const redirect = NextResponse.redirect(url);
    // Set session cookie so they only hit the gate once
    redirect.cookies.set('rcb_seen', '1', { path: '/', sameSite: 'lax' });
    return redirect;
  }

  // ── Skip heavy auth check for routes that don't need it ──────────────────
  if (!isProtectedAdminOrAccount) {
    return supabaseResponse;
  }

  // ── Full auth check (network call) — only for /dashboard and /account ────
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
              if (res instanceof Promise) res.catch(() => {});
            });
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => {
              const res = supabaseResponse.cookies.set(name, value, options);
              if (res instanceof Promise) res.catch(() => {});
            });
          } catch (e) {
            // Ignore cookie set errors in middleware context
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /account
  if (pathname.startsWith('/account') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Protect /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

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

  return supabaseResponse;
}
