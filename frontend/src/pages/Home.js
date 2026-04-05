import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20 px-10 text-center">
        <h1 className="text-6xl font-black mb-6 tracking-tight">FairRecruit AI</h1>
        <p className="text-2xl mb-12 text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
          Remove hiring bias with the power of <span className="font-bold text-white underline decoration-yellow-400">Google Cloud AI</span>. Anonymize resumes and focus purely on merit.
        </p>
        <div className="flex justify-center space-x-6">
          <Link to="/signup" className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-full font-black text-lg shadow-2xl hover:bg-yellow-300 transition-all transform hover:scale-105">
            Get Started Free
          </Link>
          <Link to="/login" className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all">
            Login
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-24 px-10">
        <h2 className="text-4xl font-black text-gray-800 text-center mb-16">Why FairRecruit?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition group">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Unbiased Screening</h3>
            <p className="text-gray-600">AI automatically redacts sensitive data (names, gender, ethnicity) to ensure fair evaluation.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition group">
            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Instant AI Scoring</h3>
            <p className="text-gray-600">Get a 0-100 match score based on job requirements extracted via Cloud Natural Language API.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition group">
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Data Insights</h3>
            <p className="text-gray-600">Candidates receive actionable feedback and tips to improve their professional profile.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition group">
            <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Team Comparison</h3>
            <p className="text-gray-600">HR can side-by-side compare top candidates based on skill verification test scores.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400 py-10 text-center">
        <p className="text-sm font-medium">© 2026 FairRecruit AI. Built for the future of hiring.</p>
      </footer>
    </div>
  );
};

export default Home;
