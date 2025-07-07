"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardCard from '../../components/DashboardCard';
import MessageChart from '../../components/MessageChart';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push(`/admin`);
          return;
        }

        const response = await fetch(`${baseUrl}/api/admin/analytics?range=day`, {
          headers: {
            'x-auth-token': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(()=>{
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
    }
  },[])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 h-[calc(100vh-64px)] overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      
      {/* Three compact cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <DashboardCard 
          title="Total Messages" 
          value={analytics?.totalMessages || 0} 
          icon="message" 
          color="blue" 
          compact
        />
        <DashboardCard 
          title="Messages Today" 
          value={analytics?.messagesPerDay[analytics?.messagesPerDay.length-1]?.count || 0} 
          icon="today" 
          color="green" 
          compact
        />
        <DashboardCard 
          title="Active Intents" 
          value={analytics?.totalIntents || 0} 
          icon="intent" 
          color="purple" 
          compact
        />
      </div>

      {/* Dual chart layout - equal size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ height: 'calc(100% - 180px)' }}>
        {/* Total Messages Trend Graph */}
        <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Total Messages Trend</h2>
          <div className="flex-1 min-h-[200px]">
            <MessageChart 
              data={analytics?.messagesPerDay || []} 
              type="trend"
            />
          </div>
        </div>

        {/* Messages Today Graph */}
        <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Messages Today</h2>
          <div className="flex-1 min-h-[200px]">
            <MessageChart 
              data={analytics?.messagesPerDay?.slice(0, 1) || []} 
              type="daily"
            />
          </div>
        </div>
      </div>
    </div>
  );
}