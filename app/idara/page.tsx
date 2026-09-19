'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function IdaraPage() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to home with idara parameter to unlock admin portal
    router.replace('/?idara');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 font-arabic p-6">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
      <h2 className="text-base font-bold text-slate-900">
        جاري الدخول إلى لوحة إدارة فرع جمعية الدعوة الإسلامية العالمية...
      </h2>
      <p className="text-xs text-slate-500 mt-2 font-mono">
        Učitavanje administrativnog portala...
      </p>
    </div>
  );
}
