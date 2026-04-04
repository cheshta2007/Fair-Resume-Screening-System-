import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, Briefcase, Filter, Search } from 'lucide-react';

const HRDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/resumes/hr-view`);
        setResumes(res.data);
      } catch (err) {
        console.error('Failed to fetch resumes');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-10">FairRecruit HR</h1>
        <nav className="flex-1 space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-700 rounded-lg cursor-pointer">
            <Users size={20} />
            <span className="font-semibold">All Resumes</span>
          </div>
          <div className="flex items-center space-x-3 p-3 hover:bg-blue-700 rounded-lg cursor-pointer transition">
            <Briefcase size={20} />
            <span>Job Roles</span>
          </div>
        </nav>
        <button onClick={logout} className="mt-auto flex items-center space-x-3 p-3 hover:bg-red-600 rounded-lg transition">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-10">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Candidate Screening</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" placeholder="Search by skills..." className="pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>
            <button className="flex items-center space-x-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50 transition text-gray-700 font-semibold">
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <table className="min-w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Anonymized Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Applied Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">AI Score</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Skills Found</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {resumes.map((resume, idx) => (
                  <tr key={resume._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-700">Candidate #{idx + 1001}</td>
                    <td className="px-6 py-4 text-gray-600">{resume.jobId?.title || 'Unknown Role'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${resume.aiScore > 75 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {resume.aiScore}/100
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {resume.extractedSkills?.slice(0, 3).map(skill => (
                          <span key={skill} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded capitalize">{skill}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 font-bold hover:underline">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
