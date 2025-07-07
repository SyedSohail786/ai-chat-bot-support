"use client";
import { FiMessageCircle } from 'react-icons/fi';

export default function PopularIntents({ intents }) {
  return (
    <div className="space-y-4">
      {intents.map((intent, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <FiMessageCircle className="text-blue-500 mr-3" />
            <span className="font-medium">{intent.name}</span>
          </div>
          <span className="text-gray-500">{intent.count} messages</span>
        </div>
      ))}
    </div>
  );
}