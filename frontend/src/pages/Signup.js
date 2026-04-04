import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [error, setError] = useState('');
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData);
      if (user.role === 'hr') navigate('/hr-dashboard');
      else navigate('/candidate-dashboard');
    } catch (err) {
      setError('Registration failed. Email might already be in use.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = await googleLogin(credentialResponse);
      if (user.role === 'hr') navigate('/hr-dashboard');
      else navigate('/candidate-dashboard');
    } catch (err) {
      setError('Google signup failed.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Create Account</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Signup Failed')}
          />
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">I am a...</label>
          <select name="role" value={formData.role} onChange={handleChange} required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="candidate">Candidate (Applying for jobs)</option>
            <option value="hr">HR / Recruiter (Screening resumes)</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Sign Up
        </button>
        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
