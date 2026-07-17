'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error during Google sign in');
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h5"
            component={Link}
            href="/"
            sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700 }}
          >
            Rose City Beauty
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Enter your credentials to sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link href="/forgot-password">
            <Typography variant="body2" color="primary">
              Forgot password?
            </Typography>
          </Link>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        <Button
          variant="outlined"
          fullWidth
          size="large"
          onClick={handleGoogleLogin}
          sx={{ mb: 3 }}
          startIcon={
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.62v3.02h3.87c2.26-2.08 3.58-5.14 3.58-8.49z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.09 1.16-3.15 0-5.81-2.13-6.76-4.99H1.27v3.12C3.26 21.31 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.24 14.24a7.16 7.16 0 0 1 0-2.48V8.64H1.27a11.96 11.96 0 0 0 0 6.72l3.97-3.12z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.69 1.27 6.72l3.97 3.12c.95-2.86 3.61-4.99 6.76-4.99z"
              />
            </svg>
          }
        >
          Sign in with Google
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link href="/register">
              <Typography component="span" color="primary" sx={{ cursor: 'pointer' }}>
                Register
              </Typography>
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <LoginForm />
    </Suspense>
  );
}
