import { useState } from 'react';
import axios from 'axios';

function AddUser({ onSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post('/users', formData);
      setSuccess('User added successfully!');
      setFormData({ name: '', email: '', age: '' });
      onSuccess(); // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Add New User</h2>
      
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text" htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="label-text" htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="label-text" htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
            className="input-field"
            placeholder="25"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
    </div>
  );
}

export default AddUser;
