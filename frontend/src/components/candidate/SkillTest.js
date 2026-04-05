import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const SkillTest = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      q: "What is the primary benefit of using React Hooks?",
      a: ["Better performance", "Use state in functional components", "Faster compilation", "Automatic SEO"],
      correct: 1
    },
    {
      q: "Which of the following is a NoSQL database?",
      a: ["PostgreSQL", "MySQL", "MongoDB", "Oracle"],
      correct: 2
    },
    {
      q: "What does REST stand for?",
      a: ["Representational State Transfer", "Responsive State Tech", "Remote Session Transfer", "Relational System Task"],
      correct: 0
    }
  ];

  const handleAnswer = (idx) => {
    if (idx === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
        <CheckCircle2 className="mx-auto text-green-500 mb-4" size={64} />
        <h3 className="text-2xl font-bold mb-2">Test Completed!</h3>
        <p className="text-gray-600 mb-6">You scored {finalScore}% in the Skill Validation Test.</p>
        <button 
          onClick={() => onComplete(finalScore)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Skill Validation Test</h3>
        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>
      
      <p className="text-lg text-gray-700 mb-8 font-medium">{questions[currentQuestion].q}</p>
      
      <div className="grid grid-cols-1 gap-4">
        {questions[currentQuestion].a.map((ans, idx) => (
          <button 
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="text-left p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-300 transition flex justify-between items-center group"
          >
            <span>{ans}</span>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SkillTest;
