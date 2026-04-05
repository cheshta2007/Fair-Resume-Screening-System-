import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Upload, CheckCircle, AlertCircle, FileText, LayoutDashboard, LogOut, GraduationCap } from 'lucide-react';
import SkillTest from '../components/candidate/SkillTest';

const CandidateDashboard = () => {
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchJobs();
    fetchMyResume();
  }, []);

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

  const fetchJobs = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/jobs`);
    setJobs(res.data);
  };

  const fetchMyResume = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/resumes/candidate-view`);
      setResume(res.data);
    } catch (err) {
      console.log('No resume found yet');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedJob) return alert('Please select a file and job role');
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobId', selectedJob);

    setUploading(true);
    try {
      await axios.post("https://y-gold-two-66.vercel.app/upload", formData);
      fetchMyResume();
      alert('Resume uploaded successfully!');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-10">CandidatePortal</h1>
        <nav className="flex-1 space-y-2">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg cursor-pointer">
            <LayoutDashboard size={20} />
            <span className="font-semibold">Dashboard</span>
          </div>
        </nav>
        <button onClick={logout} className="mt-auto flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition text-gray-600">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Hello, {user?.name}!</h2>
          <p className="text-gray-600">Track your application and improve your resume using AI.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Upload size={20} className="text-blue-600" /> Upload Resume
            </h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Job Role</label>
                <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} 
                  className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Choose a role...</option>
                  {jobs.map(job => <option key={job._id} value={job._id}>{job.title}</option>)}
                </select>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="resume-upload"/>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <FileText className="mx-auto text-gray-400 mb-2" size={32} />
                  <span className="text-sm text-gray-600 block">{file ? file.name : 'Click to select PDF/DOC'}</span>
                </label>
              </div>
              <button disabled={uploading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50">
                {uploading ? 'Processing AI...' : 'Analyze My Resume'}
              </button>
            </form>
          </div>

          {/* AI Feedback Section */}
          <div className="lg:col-span-2 space-y-6">
            {!resume ? (
              <div className="bg-blue-50 border border-blue-200 p-10 rounded-xl text-center">
                <AlertCircle className="mx-auto text-blue-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-blue-800 mb-2">No Analysis Found</h3>
                <p className="text-blue-600">Upload your resume to see your AI-driven skill match and improvement tips.</p>
              </div>
            ) : (
              <>
                <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Overall AI Score</h3>
                    <p className="text-gray-500 text-sm">Based on {resume.jobId?.title}</p>
                  </div>
                  <div className="text-4xl font-black text-blue-600 bg-blue-50 p-4 rounded-full w-24 h-24 flex items-center justify-center border-4 border-blue-200">
                    {resume.aiScore}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-bold text-green-800 flex items-center gap-2 mb-4">
                      <CheckCircle size={18} /> Strengths
                    </h4>
                    <ul className="space-y-2">
                      {resume.insights?.strengths?.map(s => <li key={s} className="text-green-700 text-sm capitalize">• {s}</li>)}
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-4">
                      <AlertCircle size={18} /> Improvement Tips
                    </h4>
                    <ul className="space-y-2">
                      {resume.insights?.suggestedImprovements?.map(s => <li key={s} className="text-yellow-700 text-sm">• {s}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Skill Test Toggle */}
                {!showTest ? (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-xl shadow-lg text-white flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <GraduationCap /> Boost Your Profile
                      </h3>
                      <p className="text-blue-100">Take a quick skill-based test to verify your expertise and get a "Verified" badge.</p>
                    </div>
                    <button 
                      onClick={() => setShowTest(true)}
                      className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-md"
                    >
                      Start Skill Test
                    </button>
                  </div>
                ) : (
                  <SkillTest onComplete={async (score) => {
                    await axios.put(`${API_BASE_URL}/api/resumes/test-score`, { score });
                    setShowTest(false);
                    fetchMyResume();
                  }} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
