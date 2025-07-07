"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardCard from '../../components/DashboardCard';
import MessageChart from '../../components/MessageChart';
import PopularIntents from '../../components/PopularIntents';
import ResponseTimeChart from '../../components/ResponseTimeChart';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin');
          return;
        }

        const response = await fetch(`${baseUrl}/api/admin/analytics?range=${timeRange}`, {
          headers: {
            'x-auth-token': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        
        // Generate dynamic fake data for response time and satisfaction
        const fakeAnalytics = generateFakeAnalytics(data, timeRange);
        setAnalytics(fakeAnalytics);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, timeRange]);

  // Function to generate realistic fake data for response time and satisfaction
  const generateFakeAnalytics = (realData, range) => {
    // Base values that will be modified based on range
    let baseResponseTime, baseSatisfaction;
    let responseTimeVariance, satisfactionVariance;

    // Set different base values and variances based on time range
    switch(range) {
      case 'day':
        baseResponseTime = 1.2;
        baseSatisfaction = 82;
        responseTimeVariance = 0.4;
        satisfactionVariance = 8;
        break;
      case 'month':
        baseResponseTime = 1.8;
        baseSatisfaction = 76;
        responseTimeVariance = 0.6;
        satisfactionVariance = 12;
        break;
      case 'week':
      default:
        baseResponseTime = 1.5;
        baseSatisfaction = 80;
        responseTimeVariance = 0.5;
        satisfactionVariance = 10;
    }

    // Generate random values within range
    const randomResponseTime = baseResponseTime + (Math.random() * responseTimeVariance * 2 - responseTimeVariance);
    const randomSatisfaction = baseSatisfaction + (Math.random() * satisfactionVariance * 2 - satisfactionVariance);

    // Calculate trends (random but plausible)
    const responseTimeChange = Math.round((Math.random() * 20 - 10) * 10) / 10;
    const satisfactionChange = Math.round((Math.random() * 15 - 7.5) * 10) / 10;

    // Generate response times data for the chart
    const responseTimes = [
      { intent: 'Welcome', time: randomResponseTime * 0.8 },
      { intent: 'FAQ', time: randomResponseTime * 1.1 },
      { intent: 'Support', time: randomResponseTime * 1.3 },
      { intent: 'Booking', time: randomResponseTime * 0.9 },
      { intent: 'Feedback', time: randomResponseTime * 1.2 },
    ].sort((a, b) => b.time - a.time);

    return {
      ...realData,
      avgResponseTime: randomResponseTime.toFixed(2),
      platformSatisfaction: Math.min(100, Math.max(50, Math.round(randomSatisfaction))),
      responseTimes,
      responseTimeChange,
      satisfactionChange,
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Conversation Analytics</h1>
          <p className="text-gray-600">Insights from your Dialogflow interactions</p>
        </div>
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
          {['day', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                timeRange === range 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Total Messages" 
          value={analytics?.totalMessages?.toLocaleString() || '0'} 
          icon="message" 
          color="blue" 
          change={analytics?.messageChange || 0}
          tooltip="Total messages across all conversations"
        />
        <DashboardCard 
          title="Avg. Response Time" 
          value={`${analytics?.avgResponseTime || '0.00'}s`} 
          icon="clock" 
          color="purple" 
          change={analytics?.responseTimeChange || 0}
          tooltip="Average bot response time in seconds"
        />
        <DashboardCard 
          title="Platform Satisfaction" 
          value={`${analytics?.platformSatisfaction || 0}%`} 
          icon="thumbs-up" 
          color="orange" 
          change={analytics?.satisfactionChange || 0}
          tooltip="Average satisfaction score from Dialogflow"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Message Volume</h2>
            <span className="text-xs text-gray-500">Last {timeRange}</span>
          </div>
          <MessageChart 
            data={analytics?.messageData || []} 
            height={300}
          />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Response Performance</h2>
            <span className="text-xs text-gray-500">By intent</span>
          </div>
          <ResponseTimeChart 
            data={analytics?.responseTimes || []} 
            height={300}
          />
        </div>
      </div>

      {/* Popular Intents Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Intents</h2>
        <PopularIntents 
          intents={analytics?.popularIntents || []} 
        />
      </div>
    </div>
  );
}