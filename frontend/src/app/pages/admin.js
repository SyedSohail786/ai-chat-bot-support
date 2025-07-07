// pages/admin.js
"use client"
import AdminPanel from '@/components/AdminPanel/AdminPanel';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  // Simple auth check - replace with your actual auth logic
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminPanel />
    </div>
  );
}