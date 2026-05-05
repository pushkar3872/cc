import { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';

// Axios default config
axios.defaults.baseURL = '/api';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center">
          User <span className="text-blue-600">Management</span> System
        </h1>
        <p className="text-center text-gray-500 mt-2">Manage your users efficiently</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            {editingUser ? (
              <EditUser
                user={editingUser}
                onSuccess={() => {
                  setEditingUser(null);
                  fetchUsers();
                }}
                onCancel={handleCancelEdit}
              />
            ) : (
              <AddUser onSuccess={fetchUsers} />
            )}
          </div>
        </div>

        {/* Right Column: User List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 min-h-[400px]">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">All Users</h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4 border border-red-200">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <UserList
                users={users}
                onEdit={handleEdit}
                onDeleteSuccess={fetchUsers}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
