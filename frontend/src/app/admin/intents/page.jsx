"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import IntentList from '../../components/IntentList';
import CreateIntentModal from '../../components/CreateIntentModal';
import { toast } from 'react-toastify';
const projectId = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID;
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function IntentsPage() {
  const [intents, setIntents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchIntents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin');
        return;
      }

      const response = await fetch(`${baseUrl}/api/admin/intents`, {
        headers: {
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch intents');
      }

      const data = await response.json();
      setIntents(data);
    } catch (err) {
      console.error('Fetch intents error:', err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntents();
  }, []);

  // In your IntentsPage component, update the handleCreateIntent function:
  const handleCreateIntent = async (newIntent) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${baseUrl}/api/admin/intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newIntent),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create intent');
      }

      // Instead of adding to local state, refresh the entire list
      fetchIntents(); // This should be your existing function that fetches all intents
      setIsModalOpen(false);
      toast.success('Intent created successfully!');
    } catch (err) {
      console.error('Create intent error:', err);
      toast.error(err.message);
    }
  };

  const handleIntentUpdated = () => {
    fetchIntents(); // Refresh the intent list
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6  bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Intents Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Intent
        </button>
      </div>

      <IntentList
        intents={intents.map(intent => ({
          ...intent,
          // Ensure we have the full name property
          name: intent.name || `projects/${projectId}/agent/intents/${intent.id}`
        }))}
        onIntentUpdated={fetchIntents}
      />

      <CreateIntentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateIntent}
      />
    </div>
  );
}