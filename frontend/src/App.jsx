import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Check if we're running in Electron or regular browser
const isElectron = typeof window !== 'undefined' && window.process && window.process.type
const API_BASE_URL = 'http://localhost:8002'

function App() {
  const [activeTab, setActiveTab] = useState('manage')
  const [activations, setActivations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchActivations()
    }
  }, [activeTab])

  const fetchActivations = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/get-all-keys`)
      setActivations(response.data.activations)
    } catch (error) {
      console.error('Error fetching activations:', error)
      alert('Error fetching activations')
    } finally {
      setLoading(false)
    }
  }

  const deactivateKey = async (activationKey) => {
    if (!confirm('Are you sure you want to deactivate this key?')) return
    
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('activation_key', activationKey)
      
      await axios.post(`${API_BASE_URL}/deactivate-key`, formData)
      alert('Key deactivated successfully!')
      fetchActivations()
    } catch (error) {
      console.error('Error deactivating key:', error)
      alert('Error deactivating key')
    } finally {
      setLoading(false)
    }
  }

  const activateKey = async (activationKey) => {
    if (!confirm('Are you sure you want to activate this key?')) return

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('activation_key', activationKey)

      await axios.post(`${API_BASE_URL}/activate-key`, formData)
      alert('Key activated successfully!')
      fetchActivations()
    } catch (error) {
      console.error('Error activating key:', error)
      alert('Error activating key')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Never expires") {
      return "Never expires"
    }
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Taskify Activation Key Manager
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Manage activation keys for Taskify application
        </p>

        {/* Manage Keys Tab */}
        {activeTab === 'manage' && (
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manage Activation Keys</h2>
              <button
                onClick={fetchActivations}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">System ID</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Activation Key</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Customer Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mobile</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Created</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Expires</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activations.map((activation, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-mono">{activation.system_id}</td>
                      <td className="px-4 py-2 text-sm font-mono">{activation.activation_key}</td>
                      <td className="px-4 py-2 text-sm">{activation.customer_name || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm">{activation.customer_mobile || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm">{activation.customer_email || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm">{formatDate(activation.created_at)}</td>
                      <td className="px-4 py-2 text-sm">{formatDate(activation.expires_at)}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          activation.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {activation.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {activation.is_active ? (
                          <button
                            onClick={() => deactivateKey(activation.activation_key)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => activateKey(activation.activation_key)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {activations.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No activation keys found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App