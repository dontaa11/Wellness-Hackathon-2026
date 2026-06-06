'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Leaf, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        toast.error('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (err) {
        setError(err.message);
        toast.error(err.message);
      } else {
        toast.success('Account created! Complete your profile.');
        router.push('/onboarding');
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setError(null);
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });

      if (err) {
        setError(err.message);
        toast.error(err.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign up failed';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary">FitEthio</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create your wellness account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email')}
            className="input-field"
            required
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password')}
            className="input-field"
            minLength={6}
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating account...' : t('signup')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background dark:bg-gray-900 text-gray-500">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          type="button"
          disabled={loading}
          className="btn-secondary w-full"
        >
          {t('google')}
        </button>

        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
