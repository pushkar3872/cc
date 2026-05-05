import { useState, useEffect } from 'react';
import axios from 'axios';

function EditUser({ user, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        age: user.age
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`/users/${user._id}`, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Edit User</h2>
      
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text" htmlFor="edit-name">Full Name</label>
          <input
            type="text"
            id="edit-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        
        <div>
          <label className="label-text" htmlFor="edit-email">Email Address</label>
          <input
            type="email"
            id="edit-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        
        <div>
          <label className="label-text" htmlFor="edit-age">Age</label>
          <input
            type="number"
            id="edit-age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
            className="input-field"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
