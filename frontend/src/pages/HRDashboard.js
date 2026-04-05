import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, Briefcase, Filter, Search, CheckCircle2, Copy } from 'lucide-react';

const HRDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResumes, setSelectedResumes] = useState([]);
  const { logout } = useAuth();

  const toggleComparison = (id) => {
    if (selectedResumes.includes(id)) {
      setSelectedResumes(selectedResumes.filter(rid => rid !== id));
    } else {
      if (selectedResumes.length < 2) setSelectedResumes([...selectedResumes, id]);
      else alert("You can only compare 2 candidates at a time.");
    }
  };

  const comparedData = resumes.filter(r => selectedResumes.includes(r._id));

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
            {/* Comparison Panel */}
            {selectedResumes.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                    <Copy size={20} /> Candidate Comparison ({selectedResumes.length}/2)
                  </h3>
                  <button onClick={() => setSelectedResumes([])} className="text-blue-600 text-sm font-bold hover:underline">Clear Selection</button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {comparedData.map((r, i) => (
                    <div key={r._id} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                      <p className="font-bold text-gray-700 mb-2">Candidate #{i + 1}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-black text-blue-600">{r.aiScore}</span>
                        <span className="text-xs text-gray-400 uppercase">AI Score</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {r.extractedSkills?.map(s => <span key={s} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded capitalize">{s}</span>)}
                      </div>
                      {r.insights?.testScore && (
                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                          <CheckCircle2 size={12} /> Verified Skill Test: {r.insights.testScore}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <table className="min-w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Select</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Anonymized Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Applied Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">AI Score</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Skills Found</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {resumes.map((resume, idx) => (
                  <tr key={resume._id} className={`hover:bg-gray-50 transition ${selectedResumes.includes(resume._id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedResumes.includes(resume._id)}
                        onChange={() => toggleComparison(resume._id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700 flex items-center gap-2">
                      Candidate #{idx + 1001}
                      {resume.insights?.testScore && <CheckCircle2 size={16} className="text-green-500" title="Verified Skill Test Completed" />}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{resume.jobTitle}</td>
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
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 font-bold hover:underline mr-4">Details</button>
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
