"use client";
import { FiMessageCircle, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const baseurl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function IntentList({ intents = [], onIntentUpdated }) {
  const router = useRouter();

  const handleEdit = (intent) => {
    const fullPath=intent.name
    const intentId = fullPath.split('/').pop();
  router.push(`/admin/edit/${intentId}`);
};

  const handleDelete = async (intentName) => {
    if (!confirm('Are you sure you want to delete this intent?')) return;
    const intentId = intentName.split('/').pop();
    try {
      const encodedName = encodeURIComponent(intentId);
      const response = await fetch(`${baseurl}/api/admin/intents/${encodedName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken'),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete intent');
      }

      toast.success('Intent deleted successfully');
      onIntentUpdated();
    } catch (error) {
      toast.error(error.message || 'Failed to delete intent');
      console.error('Delete error:', error);
    }
  };

  const getDisplayName = (intent) => {
    return intent.displayName || intent.name.split('/').pop();
  };

  const getTrainingPhrasesCount = (intent) => {
    return intent.trainingPhrases?.length || 
           intent.trainingPhrasesParts?.length || 
           0;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Training
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responses
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {intents.map((intent) => (
              <tr key={intent.name || intent.intentId} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <FiMessageCircle size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{getDisplayName(intent)}</div>
                      <div className="text-xs text-gray-500">#{intent.name.split('/').pop()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {getTrainingPhrasesCount(intent)} phrases
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {intent.messages?.length || 0} responses
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(intent)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                      aria-label="Edit intent"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(intent.name || intent.intentId)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                      aria-label="Delete intent"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {intents.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <FiMessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium">No intents found</p>
          <p className="text-sm">Create your first intent to get started</p>
        </div>
      )}
    </div>
  );
}