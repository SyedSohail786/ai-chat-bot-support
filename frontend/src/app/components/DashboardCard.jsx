"use client";
import { 
  FiMessageSquare, 
  FiCalendar, 
  FiList, 
  FiUsers, 
  FiClock, 
  FiThumbsUp,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';

const icons = {
  message: FiMessageSquare,
  today: FiCalendar,
  intent: FiList,
  users: FiUsers,
  clock: FiClock,
  'thumbs-up': FiThumbsUp,
};

const colors = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
};

export default function DashboardCard({ title, value, icon, color, change = 0 }) {
  const Icon = icons[icon];
  const isPositive = change >= 0;
  
  // Safely handle the value prop
  const displayValue = () => {
    if (typeof value === 'object') {
      // If it's an object with a count property (like messagesPerDay)
      if ('count' in value) {
        return value.count;
      }
      // If it's an object we can't handle, return a fallback
      return 0;
    }
    return value;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{displayValue()}</p>
          {change !== 0 && (
            <p className={`text-sm mt-1 flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? (
                <FiTrendingUp className="mr-1" />
              ) : (
                <FiTrendingDown className="mr-1" />
              )}
              {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}