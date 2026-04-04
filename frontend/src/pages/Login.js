import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'hr') navigate('/hr-dashboard');
      else navigate('/candidate-dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = await googleLogin(credentialResponse);
      if (user.role === 'hr') navigate('/hr-dashboard');
      else navigate('/candidate-dashboard');
    } catch (err) {
      setError('Google login failed.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Welcome Back</h2>
        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
        
        <div className="flex justify-center mb-8">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            useOneTap
          />
        </div>

        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Login
        </button>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
