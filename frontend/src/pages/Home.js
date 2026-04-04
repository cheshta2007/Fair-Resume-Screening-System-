import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-600 text-white p-4">
      <h1 className="text-5xl font-bold mb-6">Fair Resume Screening System</h1>
      <p className="text-xl mb-10 text-center max-w-2xl">
        An AI-powered platform for unbiased hiring. Evaluate candidates based purely on skills and merit using Google Cloud AI.
      </p>
      <div className="flex space-x-6">
        <Link to="/login" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition">
          Login
        </Link>
        <Link to="/signup" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
