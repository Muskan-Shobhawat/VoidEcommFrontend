'use client';
import dynamic from 'next/dynamic';

export function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-24 w-24 rounded-full border border-bone/10 border-t-signal animate-spinSlow" style={{ animationDuration: '1.4s' }} />
    </div>
  );
}

export const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false, loading: () => <SceneLoader /> });
