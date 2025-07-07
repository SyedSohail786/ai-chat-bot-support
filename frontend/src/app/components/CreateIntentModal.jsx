"use client";
import { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

export default function CreateIntentModal({ isOpen, onClose, onSubmit }) {
  const [intentName, setIntentName] = useState('');
  const [trainingPhrases, setTrainingPhrases] = useState(['']);
  const [responses, setResponses] = useState(['']);

  const handleAddPhrase = () => {
    setTrainingPhrases([...trainingPhrases, '']);
  };

  const handleRemovePhrase = (index) => {
    const newPhrases = [...trainingPhrases];
    newPhrases.splice(index, 1);
    setTrainingPhrases(newPhrases);
  };

  const handlePhraseChange = (index, value) => {
    const newPhrases = [...trainingPhrases];
    newPhrases[index] = value;
    setTrainingPhrases(newPhrases);
  };

  const handleAddResponse = () => {
    setResponses([...responses, '']);
  };

  const handleRemoveResponse = (index) => {
    const newResponses = [...responses];
    newResponses.splice(index, 1);
    setResponses(newResponses);
  };

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      displayName: intentName,
      trainingPhrases: trainingPhrases.filter(phrase => phrase.trim() !== ''),
      messages: responses.filter(response => response.trim() !== ''),
    });
    // Reset form
    setIntentName('');
    setTrainingPhrases(['']);
    setResponses(['']);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create New Intent</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intent Name
              </label>
              <input
                type="text"
                value={intentName}
                onChange={(e) => setIntentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Training Phrases
              </label>
              {trainingPhrases.map((phrase, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={phrase}
                    onChange={(e) => handlePhraseChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Example phrase"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhrase(index)}
                    className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPhrase}
                className="mt-2 flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
              >
                <FiPlus className="mr-1" /> Add Phrase
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responses
              </label>
              {responses.map((response, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={response}
                    onChange={(e) => handleResponseChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bot response"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveResponse(index)}
                    className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddResponse}
                className="mt-2 flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
              >
                <FiPlus className="mr-1" /> Add Response
              </button>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Intent
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}