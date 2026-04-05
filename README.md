# Fair Resume Screening System (Unbiased Hiring AI)

Build a web platform that removes hiring bias by anonymizing resumes and evaluating candidates purely on skills using Google Cloud AI.

## Core Features
- **HR Dashboard:** View anonymized resumes, AI scores, and compare candidates.
- **Candidate Dashboard:** Upload resumes, get AI insights, and take skill tests.
- **AI Chatbot:** Real-time career assistant using Dialogflow.
- **Anonymization:** Automatically redacts names, emails, and phone numbers.
- **Explainable AI:** Provides strengths, weaknesses, and improvement tips.

## Tech Stack
- **Frontend:** React.js + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Google Cloud:** Natural Language API, Dialogflow, Cloud Functions

---

## 🚀 Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas URI)
- [Git](https://git-scm.com/downloads)

### 2. Local Installation
In the project root folder:
```bash
# Install root dependencies
npm install

# Install backend and frontend dependencies
npm run install-all

# Run the project locally
npm start
```

### 3. Environment Variables
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GOOGLE_APPLICATION_CREDENTIALS=./google-creds.json
DIALOGFLOW_PROJECT_ID=your_project_id
```

---

## 💻 GitHub Desktop Integration

Follow these steps to publish your project:

1. **Install Git:** If you haven't installed it, run the installer in your `Downloads` folder.
2. **Open GitHub Desktop.**
3. **Click "Add" -> "Add Local Repository".**
4. **Select this folder:** `C:\Users\Cheshta\Desktop\Fair-Resume-Screening-System`
5. **Click "Initialize Git"** (if prompted).
6. **Click "Publish Repository"** to upload to GitHub.

---

## ☁️ Deployment

### Frontend (Vercel)
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the `frontend/` directory.
3. Follow the prompts.

### Backend (Render)
1. Sign up on [Render.com](https://render.com/).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically use the `render.yaml` to deploy.

---

## 📄 License
MIT License. Created for Solution Challenge 2026.
