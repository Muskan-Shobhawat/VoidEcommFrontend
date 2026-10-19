'use client';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { api } from '@/lib/api';

export default function Newsletter({ compact = false }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading' });
    try {
      const r = await api.newsletter(email);
      setState({ status: 'done', message: r.message });
      setEmail('');
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  };

  return (
    <div>
      {!compact && <p className="text-xs uppercase tracking-[0.3em] text-signal mb-3">Transmission</p>}
      <p className={compact ? 'text-xs uppercase tracking-[0.25em] text-mute mb-4' : 'font-display font-extrabold text-3xl md:text-5xl tracking-tight'}>
        {compact ? 'Newsletter' : 'Get early access to drops.'}
      </p>
      <form onSubmit={submit} className="mt-5 flex flex-col sm:flex-row gap-2">
        <input type="email" required className="form-control" placeholder="you@orbit.io" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" variant="contained" disabled={state.status === 'loading'} sx={{ whiteSpace: 'nowrap' }}>
          {state.status === 'loading' ? 'Sending…' : 'Join'}
        </Button>
      </form>
      {state.message && <p className={`mt-3 text-sm ${state.status === 'error' ? 'text-signal' : 'text-acid'}`}>{state.message}</p>}
    </div>
  );
}
