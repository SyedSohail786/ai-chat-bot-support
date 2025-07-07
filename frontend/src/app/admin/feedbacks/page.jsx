'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronDown, FiChevronUp, FiMail, FiUser, FiMessageSquare, FiClock, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [expandedContact, setExpandedContact] = useState(null);
  const router = useRouter();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin');
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/contact?page=${pagination.page}&limit=${pagination.limit}&sort=${sortConfig.direction === 'asc' ? sortConfig.key : `-${sortConfig.key}`}&search=${searchTerm}`,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch contacts');

      setContacts(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(error.message);
      if (error.message.includes('token')) {
        router.push('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [pagination.page, sortConfig, searchTerm]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${baseUrl}/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete contact');

      toast.success('Contact deleted successfully');
      fetchContacts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <FiChevronDown className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* TABLE VIEW */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                      <div className="flex items-center">Name <SortIcon column="name" /></div>
                    </th>
                    <th onClick={() => handleSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                      <div className="flex items-center">Email <SortIcon column="email" /></div>
                    </th>
                    <th onClick={() => handleSort('createdAt')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                      <div className="flex items-center">Date <SortIcon column="createdAt" /></div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {contacts.map((contact) => (
                      <motion.tr key={contact._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FiUser className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FiMail className="mr-2 text-gray-400" /> {contact.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiClock className="mr-2 text-gray-400" /> {formatDate(contact.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button onClick={() => setExpandedContact(expandedContact === contact._id ? null : contact._id)} className="text-blue-600 hover:text-blue-900">
                              {expandedContact === contact._id ? 'Hide' : 'View'}
                            </button>
                            <button onClick={() => handleDelete(contact._id)} className="text-red-600 hover:text-red-900">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="block sm:hidden space-y-4">
              {contacts.map((contact) => (
                <div key={contact._id} className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                      <FiUser />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center">
                        <FiMail className="mr-1" /> {contact.email}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-4">
                    {contact.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <FiClock className="mr-1" /> {formatDate(contact.createdAt)}
                  </p>
                  <div className="mt-3 flex justify-between">
                    <button
                      onClick={() => setExpandedContact(expandedContact === contact._id ? null : contact._id)}
                      className="text-blue-600 text-sm"
                    >
                      {expandedContact === contact._id ? 'Hide' : 'View'}
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="text-red-600 text-sm flex items-center gap-1"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminContacts;
