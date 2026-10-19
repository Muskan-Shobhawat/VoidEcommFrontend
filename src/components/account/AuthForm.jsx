'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { api } from '@/lib/api';
import { DEMO_ACCOUNT } from '@/lib/localAccount';
import { useAuth } from '@/store/auth';

/* Only follow same-site paths after signing in. */
const safeNext = (next) => (next?.startsWith('/') && !next.startsWith('//') ? next : '/account');

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const { user, setSession } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  // Already signed in: go straight on.
  useEffect(() => { if (user) router.replace(next); }, [user, next, router]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (body) => {
    setStatus('loading'); setError('');
    try {
      setSession(await (isSignup ? api.signup(body) : api.login(body)));
    } catch (err) {
      setError(err.message); setStatus('idle');
    }
  };

  const switchHref = `${isSignup ? '/login' : '/signup'}${next !== '/account' ? `?next=${encodeURIComponent(next)}` : ''}`;

  return (
    <div className="wrap pt-28 md:pt-36 pb-10">
      <div className="mx-auto max-w-md">
        <p className="text-xs uppercase tracking-[0.3em] text-signal mb-3">Account</p>
        <h1 className="font-display font-extrabold text-5xl md:text-6xl tracking-tight leading-none">
          {isSignup ? 'Join the void' : 'Welcome back'}<span className="text-signal">.</span>
        </h1>
        <p className="text-mute mt-3">{isSignup ? 'Create an account to track orders and check out faster.' : 'Sign in to see your orders and check out faster.'}</p>

        <form onSubmit={(e) => { e.preventDefault(); submit(isSignup ? form : { email: form.email, password: form.password }); }} className="glass rounded-3xl p-6 md:p-8 mt-8 flex flex-col gap-4">
          {isSignup && (
            <div><label className="form-label" htmlFor="name">Full name</label><input id="name" required autoComplete="name" className="form-control" value={form.name} onChange={set('name')} placeholder="Ada Lovelace" /></div>
          )}
          <div><label className="form-label" htmlFor="email">Email</label><input id="email" required type="email" autoComplete="email" className="form-control" value={form.email} onChange={set('email')} placeholder="ada@orbit.io" /></div>
          <div>
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" required type="password" minLength={6} autoComplete={isSignup ? 'new-password' : 'current-password'} className="form-control" value={form.password} onChange={set('password')} placeholder={isSignup ? 'At least 6 characters' : ''} />
          </div>
          {error && <p className="text-signal text-sm m-0" role="alert">{error}</p>}
          <Button type="submit" variant="contained" size="large" fullWidth disabled={status === 'loading'}>
            {status === 'loading' ? 'One moment…' : isSignup ? 'Create account' : 'Sign in'}
          </Button>
          {!isSignup && (
            <Button variant="outlined" fullWidth disabled={status === 'loading'} onClick={() => submit({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })} sx={{ borderColor: 'rgb(var(--bone-rgb) / 0.25)', color: 'text.primary' }}>
              Use demo account
            </Button>
          )}
          <p className="text-sm text-mute text-center m-0">
            {isSignup ? 'Already have an account?' : 'New here?'}{' '}
            <Link href={switchHref} className="text-bone underline underline-offset-4">{isSignup ? 'Sign in' : 'Create an account'}</Link>
          </p>
        </form>
        <p className="text-xs text-mute mt-4 text-center">Demo only: accounts are kept in memory on the demo server and reset when it restarts.</p>
      </div>
    </div>
  );
}
