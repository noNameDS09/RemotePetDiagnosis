'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      router.push('/');
      router.refresh();
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg font-medium">
      Logging you out...
    </div>
  );
}
