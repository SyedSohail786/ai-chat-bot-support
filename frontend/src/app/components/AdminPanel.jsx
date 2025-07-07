// components/AdminPanel/AdminPanel.jsx
"use client"
import { useState } from 'react';
import { 
  FiBox, 
  FiMessageSquare, 
  FiSettings, 
  FiUsers, 
  FiDatabase,
  FiLogOut,
  FiHome
} from 'react-icons/fi';
import IntentsManager from './IntentsManager';
import EntitiesManager from './EntitiesManager';
import TrainingPhrasesManager from './TrainingPhrasesManager';
import UserMessagesManager from './UserMessagesManager';
import SettingsManager from './SettingsManager';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('intents');
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Bot Trainer</h2>
          <button 
            onClick={() => router.push('/')}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="Go to main site"
          >
            <FiHome className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-2 space-y-1">
          <button 
            onClick={() => setActiveTab('intents')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${activeTab === 'intents' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiMessageSquare className="w-5 h-5" />
            <span>Intents</span>
          </button>
          <button 
            onClick={() => setActiveTab('entities')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${activeTab === 'entities' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiDatabase className="w-5 h-5" />
            <span>Entities</span>
          </button>
          <button 
            onClick={() => setActiveTab('training')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${activeTab === 'training' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiBox className="w-5 h-5" />
            <span>Training Phrases</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiUsers className="w-5 h-5" />
            <span>User Messages</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-red-600 hover:bg-red-50"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'intents' && <IntentsManager />}
        {activeTab === 'entities' && <EntitiesManager />}
        {activeTab === 'training' && <TrainingPhrasesManager />}
        {activeTab === 'users' && <UserMessagesManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </div>
    </div>
  );
}