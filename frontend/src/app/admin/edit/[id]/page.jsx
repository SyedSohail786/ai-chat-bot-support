'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiSave, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EditIntentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [intent, setIntent] = useState({
    displayName: '',
    trainingPhrases: [],
    messages: []
  });

  const [loading, setLoading] = useState(true);
  const [newPhrase, setNewPhrase] = useState('');
  const [newResponse, setNewResponse] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }

    const fetchIntent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/intent/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        const trainingPhrases = data.intent.trainingPhrases.map(phrase =>
          phrase.parts?.[0]?.text || phrase
        );

        const messages = data.intent.messages.flatMap(message =>
          message.text?.text || []
        );

        setIntent({
          displayName: data.intent.displayName,
          trainingPhrases,
          messages
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.push('/admin/intents');
      }
    };

    fetchIntent();
  }, [id]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      const updatedTrainingPhrases = [...intent.trainingPhrases];
      const updatedMessages = [...intent.messages];

      if (newPhrase.trim()) updatedTrainingPhrases.push(newPhrase.trim());
      if (newResponse.trim()) updatedMessages.push(newResponse.trim());

      const dataToSend = {
        displayName: intent.displayName,
        trainingPhrases: updatedTrainingPhrases,
        messages: updatedMessages
      };

      const response = await fetch(`${API_URL}/api/admin/intent-update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update intent');

      toast.success('Intent updated successfully');
      router.push('/admin/intents');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this intent?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/intents/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken'),
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete intent');

      toast.success('Intent deleted successfully');
      router.push('/admin/intents');
    } catch (error) {
      toast.error(error.message || 'Failed to delete intent');
      console.error('Delete error:', error);
    }
  };

  const addTrainingPhrase = () => {
    if (!newPhrase.trim()) return;
    setIntent(prev => ({
      ...prev,
      trainingPhrases: [...prev.trainingPhrases, newPhrase.trim()]
    }));
    setNewPhrase('');
  };

  const addResponse = () => {
    if (!newResponse.trim()) return;
    setIntent(prev => ({
      ...prev,
      messages: [...prev.messages, newResponse.trim()]
    }));
    setNewResponse('');
  };

  const removeTrainingPhrase = (index) => {
    const updated = [...intent.trainingPhrases];
    updated.splice(index, 1);
    setIntent({ ...intent, trainingPhrases: updated });
  };

  const removeResponse = (index) => {
    const updated = [...intent.messages];
    updated.splice(index, 1);
    setIntent({ ...intent, messages: updated });
  };

  if (loading) return <div className="flex justify-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Edit Intent: {intent.displayName}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FiSave /> Save
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Display Name</label>
        <input
          type="text"
          value={intent.displayName}
          onChange={(e) => setIntent({ ...intent, displayName: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Training Phrases */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Training Phrases</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {intent.trainingPhrases.map((phrase, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="break-words">{phrase}</span>
                <button onClick={() => removeTrainingPhrase(index)} className="text-red-500 hover:text-red-700">
                  <FiX />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              placeholder="Add new training phrase"
              className="flex-1 p-2 border rounded"
              onKeyDown={(e) => e.key === 'Enter' && addTrainingPhrase()}
            />
            <button onClick={addTrainingPhrase} className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
              <FiPlus />
            </button>
          </div>
        </div>

        {/* Responses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Responses</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {intent.messages.map((message, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="break-words">{message}</span>
                <button onClick={() => removeResponse(index)} className="text-red-500 hover:text-red-700">
                  <FiX />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              placeholder="Add new response"
              className="flex-1 p-2 border rounded"
              onKeyDown={(e) => e.key === 'Enter' && addResponse()}
            />
            <button onClick={addResponse} className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
              <FiPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
