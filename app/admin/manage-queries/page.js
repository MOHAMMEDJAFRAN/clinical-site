'use client';

import { useState } from 'react';
import { FiSearch, FiFilter, FiMessageSquare, FiClock, FiCheck, FiX, FiAlertCircle, FiEye, FiUsers, FiHome, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ManageQueries() {
  const [activeTab, setActiveTab] = useState('clinical'); // 'clinical' or 'user'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expandedQueries, setExpandedQueries] = useState([]);

  // Sample clinical query data
  const [clinicalQueries, setClinicalQueries] = useState([
    {
      id: 1,
      clinic: 'Colombo Medical Center',
      subject: 'Appointment System Issue',
      message: 'Patients are unable to book appointments through the website since yesterday.',
      status: 'pending',
      date: '2023-06-15',
      from: 'Dr. Perera',
      email: 'perera@colombo.com'
    },
    {
      id: 2,
      clinic: 'Kandy Health Clinic',
      subject: 'Medicine Stock Inquiry',
      message: 'Need to check availability of insulin vials for next month.',
      status: 'resolved',
      date: '2023-06-10',
      from: 'Dr. Fernando',
      email: 'fernando@kandy.com'
    },
    {
      id: 3,
      clinic: 'Galle General Hospital',
      subject: 'System Access Request',
      message: 'Two new doctors need access to the patient management system.',
      status: 'in-progress',
      date: '2023-06-12',
      from: 'Dr. Silva',
      email: 'silva@galle.com'
    },
    {
      id: 4,
      clinic: 'Jaffna Medical Hub',
      subject: 'Billing Discrepancy',
      message: 'Incorrect charges appearing for lab tests in the system.',
      status: 'pending',
      date: '2023-06-14',
      from: 'Dr. Rajan',
      email: 'rajan@jaffna.com'
    },
  ]);

  // Sample user query data
  const [userQueries, setUserQueries] = useState([
    {
      id: 1,
      name: 'John Smith',
      subject: 'Login Issues',
      message: 'I cannot login to my account despite resetting my password multiple times.',
      status: 'pending',
      date: '2023-06-16',
      email: 'john.smith@example.com',
      phone: '+94771234567'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      subject: 'Appointment Cancellation',
      message: 'I need to cancel my appointment but the system shows an error when I try.',
      status: 'in-progress',
      date: '2023-06-14',
      email: 'maria.g@example.com',
      phone: '+94777654321'
    },
    {
      id: 3,
      name: 'David Johnson',
      subject: 'Prescription Access',
      message: 'How can I access my previous prescriptions? I cannot find them in the portal.',
      status: 'resolved',
      date: '2023-06-10',
      email: 'david.j@example.com',
      phone: '+94779876543'
    },
  ]);

  // Get current queries based on active tab
  const currentQueries = activeTab === 'clinical' ? clinicalQueries : userQueries;
  const setCurrentQueries = activeTab === 'clinical' ? setClinicalQueries : setUserQueries;

  // Filter queries based on search and status
  const filteredQueries = currentQueries.filter(query => {
    const searchFields = activeTab === 'clinical' 
      ? [query.clinic, query.subject, query.from]
      : [query.name, query.subject, query.email];
    
    const matchesSearch = searchFields.some(field => 
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = filterStatus === 'all' || query.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Update query status
  const updateStatus = (id, newStatus) => {
    setCurrentQueries(currentQueries.map(query => 
      query.id === id ? { ...query, status: newStatus } : query
    ));
  };

  // Send reply to query
  const sendReply = () => {
    if (!replyText.trim()) return;
    
    const updatedQueries = currentQueries.map(query => 
      query.id === selectedQuery.id 
        ? { ...query, reply: replyText, status: 'resolved' } 
        : query
    );
    
    setCurrentQueries(updatedQueries);
    setReplyText('');
    setSelectedQuery(null);
  };

  // Toggle query expansion for mobile view
  const toggleQueryExpansion = (id) => {
    setExpandedQueries(prev => 
      prev.includes(id) 
        ? prev.filter(queryId => queryId !== id) 
        : [...prev, id]
    );
  };

  // Get status color and icon
  const getStatusProps = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock /> };
      case 'in-progress':
        return { color: 'bg-blue-100 text-blue-800', icon: <FiAlertCircle /> };
      case 'resolved':
        return { color: 'bg-green-100 text-green-800', icon: <FiCheck /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <FiMessageSquare /> };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Queries</h1>
            <p className="text-gray-600 mt-1">Review and respond to inquiries from users and clinical centers</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab === 'clinical' ? 'clinical' : 'user'} queries...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 text-gray-500 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center w-full md:w-auto">
              <div className="relative w-full md:w-40">
                <FiFilter className="absolute left-3 top-3 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full text-gray-400 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('clinical')}
            className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'clinical' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiHome className="mr-2" />
            Clinical Queries
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'user' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiUsers className="mr-2" />
            User Queries
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'clinical' ? 'Clinic' : 'User'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'clinical' ? 'From' : 'Contact'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQueries.length > 0 ? (
                  filteredQueries.map((query) => {
                    const statusProps = getStatusProps(query.status);
                    return (
                      <tr 
                        key={query.id} 
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {activeTab === 'clinical' ? query.clinic : query.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{query.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {activeTab === 'clinical' ? (
                            <div className="text-gray-500">{query.from}</div>
                          ) : (
                            <div className="text-gray-500">
                              <div>{query.email}</div>
                              <div className="text-sm">{query.phone}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{query.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusProps.color} flex items-center gap-1`}>
                            {statusProps.icon}
                            {query.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedQuery(query)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                          >
                            <FiEye /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No queries found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden space-y-3">
          {filteredQueries.length > 0 ? (
            filteredQueries.map((query) => {
              const statusProps = getStatusProps(query.status);
              return (
                <div key={query.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleQueryExpansion(query.id)}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{query.subject}</h3>
                      <p className="text-sm text-gray-500">
                        {activeTab === 'clinical' ? query.clinic : query.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusProps.color}`}>
                        {query.status.replace('-', ' ')}
                      </span>
                      <div className="text-gray-400">
                        {expandedQueries.includes(query.id) ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>
                  </div>
                  
                  {expandedQueries.includes(query.id) && (
                    <div className="p-4 border-t border-gray-100 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">From:</span>
                        <span className="text-sm text-gray-900">
                          {activeTab === 'clinical' ? query.from : query.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Contact:</span>
                        <span className="text-sm text-gray-900">
                          {activeTab === 'clinical' ? query.email : `${query.email} / ${query.phone}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date:</span>
                        <span className="text-sm text-gray-900">{query.date}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Message:</h4>
                        <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{query.message}</p>
                      </div>
                      {query.reply && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Reply:</h4>
                          <p className="text-sm text-gray-800 bg-indigo-50 p-2 rounded">{query.reply}</p>
                        </div>
                      )}
                      <div className="pt-2 flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedQuery(query)}
                          className="w-full text-indigo-600 hover:text-indigo-800 flex items-center justify-center transition-colors text-sm"
                        >
                          <FiEye className="mr-1" />
                          View Details
                        </button>
                        {!query.reply && (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => updateStatus(query.id, 'pending')}
                              className={`px-2 py-1 text-xs rounded ${query.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                              Pending
                            </button>
                            <button
                              onClick={() => updateStatus(query.id, 'in-progress')}
                              className={`px-2 py-1 text-xs rounded ${query.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                              In Progress
                            </button>
                            <button
                              onClick={() => updateStatus(query.id, 'resolved')}
                              className={`px-2 py-1 text-xs rounded ${query.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                              Resolved
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-4">
                <FiFilter size={36} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No queries found</h3>
              <p className="text-gray-500 mt-1 text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Query Detail Modal */}
        {selectedQuery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 md:p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">{selectedQuery.subject}</h3>
                    <p className="text-gray-600 mt-1">
                      {activeTab === 'clinical' ? selectedQuery.clinic : selectedQuery.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedQuery(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">
                    {activeTab === 'clinical' ? 'FROM' : 'CONTACT DETAILS'}
                  </h4>
                  <div className="text-gray-800">
                    {activeTab === 'clinical' ? (
                      <>
                        {selectedQuery.from} &lt;{selectedQuery.email}&gt;
                      </>
                    ) : (
                      <>
                        <div>{selectedQuery.name}</div>
                        <div>{selectedQuery.email}</div>
                        <div>{selectedQuery.phone}</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">DATE</h4>
                  <p className="text-gray-800">{selectedQuery.date}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">MESSAGE</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-line">{selectedQuery.message}</p>
                  </div>
                </div>

                {selectedQuery.reply && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">YOUR REPLY</h4>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-line">{selectedQuery.reply}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 md:p-6 border-t">
                {!selectedQuery.reply ? (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-500">REPLY TO QUERY</h4>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows="4"
                      className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Type your response here..."
                    />
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => updateStatus(selectedQuery.id, 'pending')}
                          className={`px-2 py-1 text-xs md:text-sm rounded ${selectedQuery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => updateStatus(selectedQuery.id, 'in-progress')}
                          className={`px-2 py-1 text-xs md:text-sm rounded ${selectedQuery.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => updateStatus(selectedQuery.id, 'resolved')}
                          className={`px-2 py-1 text-xs md:text-sm rounded ${selectedQuery.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          Resolved
                        </button>
                      </div>
                      <button
                        onClick={sendReply}
                        disabled={!replyText.trim()}
                        className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={() => setSelectedQuery(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}