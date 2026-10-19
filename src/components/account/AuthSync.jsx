'use client';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';

/** Checks a saved session once per load and signs out if the server no longer knows it (demo server restarted). */
export default function AuthSync() {
  const token = useAuth((s) => s.token);
  useEffect(() => {
    if (!token) return;
    api.me(token)
      .then(({ user }) => { if (user) useAuth.setState({ user }); })
      .catch((err) => { if (err.status === 401) useAuth.getState().clear(); });
  }, [token]);
  return null;
}
