# Fair Resume Screening System (Unbiased Hiring AI)

A full-stack web application designed to remove unconscious bias from the hiring process. This system anonymizes resumes and evaluates candidates purely on their skills and experience using AI.

---

## 🚀 Key Features

### For HR / Recruiters:
- **Anonymized Candidate View:** Names, emails, and phone numbers are hidden to prevent bias.
- **AI Scoring:** Each resume is automatically scored (0-100) against the job description.
- **Skill Extraction:** AI extracts key skills and highlights them.

### For Candidates:
- **Resume Upload & Analysis:** Upload your resume (PDF/DOC) and receive instant AI feedback.
- **Improvement Tips:** AI suggests missing keywords and ways to improve your score.
- **Status Tracking:** View your application status (Shortlisted, Reviewed, etc.).

---

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Integration:** Mocked AI logic (Ready for Google Cloud Natural Language API)

---

## ⚙️ Setup Instructions

### Prerequisites:
- **Node.js** (v14+)
- **MongoDB** (Local or Atlas)

### 1. Clone & Install Dependencies
From the root folder, run:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory (use `.env.example` as a template):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fair-resume-screening
JWT_SECRET=your_secret_key
```

### 3. Seed Initial Data (Important for Testing)
Run the seeding script to create a sample HR user and job roles:
```bash
node database/seed.js
```
**Login for HR:** `hr@example.com` / `password123`

### 4. Start the Application
Go back to the root directory and run:
```bash
npm start
```
This will start both the backend (Port 5000) and frontend (Port 3000) concurrently.

---

## ☁️ Google Cloud Integration (Future Setup)
To enable real Google Cloud AI features:
1. Enable **Cloud Natural Language API** in Google Cloud Console.
2. Download your **Service Account JSON key**.
3. Set the `GOOGLE_APPLICATION_CREDENTIALS` path in your `.env` file.
4. Replace the mock functions in `backend/controllers/resumeController.js` with calls to `@google-cloud/language`.

---

## 📄 License
MIT License. Created for the Fair Resume Screening System.
