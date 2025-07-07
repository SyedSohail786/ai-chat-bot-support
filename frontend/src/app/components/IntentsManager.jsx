// components/IntentsManager.jsx
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function IntentsManager() {
  const [intents, setIntents] = useState([]);
  const [newIntent, setNewIntent] = useState({
    displayName: '',
    trainingPhrases: [],
    messages: []
  });

  useEffect(() => {
    fetchIntents();
  }, []);

  const fetchIntents = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/dialogflow/intents`);
      setIntents(response.data);
    } catch (error) {
      console.error('Error fetching intents:', error);
    }
  };

  const handleCreateIntent = async () => {
    try {
      await axios.post(`${baseUrl}/api/dialogflow/intents`, newIntent);
      setNewIntent({
        displayName: '',
        trainingPhrases: [],
        messages: []
      });
      fetchIntents();
    } catch (error) {
      console.error('Error creating intent:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Intents</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Create New Intent</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intent Name</label>
            <input
              type="text"
              value={newIntent.displayName}
              onChange={(e) => setNewIntent({...newIntent, displayName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., welcome.greeting"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Training Phrases (one per line)</label>
            <textarea
              value={newIntent.trainingPhrases.join('\n')}
              onChange={(e) => setNewIntent({
                ...newIntent,
                trainingPhrases: e.target.value.split('\n').filter(phrase => phrase.trim())
              })}
              className="w-full p-2 border border-gray-300 rounded-md h-32"
              placeholder="Hello\nHi there!\nGood morning"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Response Messages (one per line)</label>
            <textarea
              value={newIntent.messages.join('\n')}
              onChange={(e) => setNewIntent({
                ...newIntent,
                messages: e.target.value.split('\n').filter(msg => msg.trim())
              })}
              className="w-full p-2 border border-gray-300 rounded-md h-32"
              placeholder="Hello! How can I help you?\nHi there! What can I do for you today?"
            />
          </div>
          
          <button
            onClick={handleCreateIntent}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Intent
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Existing Intents</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Phrases</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {intents.map((intent) => (
                <tr key={intent.name}>
                  <td className="px-6 py-4 whitespace-nowrap">{intent.displayName}</td>
                  <td className="px-6 py-4">
                    <div className="max-h-20 overflow-y-auto">
                      {intent.trainingPhrases?.join(', ') || 'None'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-h-20 overflow-y-auto">
                      {intent.messages?.join(', ') || 'None'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}