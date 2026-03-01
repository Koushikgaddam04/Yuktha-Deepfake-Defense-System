# YUKTHA: Multi-modal AI for Authentic Digital Content Verification

Deepfake media generated using advanced generative models poses a serious threat to digital trust, enabling misinformation, identity fraud, and social manipulation. 

**YUKTHA** is a lean, multimodal deepfake detection system that integrates spatial, temporal, audio, frequency, physiological, and lip-sync cues through a robust learning-based fusion framework to detect artificial content.

## Project Structure

This project is divided into two main components:
- **`backend/`**: A Python FastAPI server that handles the AI model inferences (EfficientNet, TCN, SyncNet, etc.) and deep scanning logic.
- **`frontend/`**: A React + Vite application that serves the beautiful UI for uploading media and viewing the interactive architecture explanations.

---

## 🚀 Getting Started

If you've just cloned this repository, follow these steps to get the project running locally on your machine.

### Prerequisites
You need to have the following installed on your machine:
- **Python 3.9+** (For the backend)
- **Node.js 18+** (For the frontend)
- **NPM / Yarn** (Comes with Node.js)

---

### Step 1: Setting up the Backend (FastAPI)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. (Highly Recommended) Create and activate a Virtual Environment to keep dependencies clean:
   - **Windows:**
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install the required Python packages (PyTorch, OpenCV, FastAPI, etc.):
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   *You should see a message indicating the server is running on `http://localhost:8000`.*

---

### Step 2: Setting up the Frontend (React + Vite)

1. Open a **new** terminal window (leave the backend running) and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install the necessary Node.js dependencies (React Router, Tailwind CSS, Lucide icons, etc.):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### Step 3: Using the Application

- Open your web browser and go to the link provided by Vite (usually **[http://localhost:5173](http://localhost:5173)**).
- You can navigate through the **Home**, **Know More**, and **System Architecture** pages to understand the YUKTHA pipeline.
- Go to the **Test** page to upload a video or image. (Ensure your backend server is running in the background, or the upload will fail to analyze!).

---

## Core Technologies

- **Frontend:** React 19, Vite, Tailwind CSS (v3.4), React Router, Lucide React
- **Backend:** Python, FastAPI, Uvicorn, PyTorch, OpenCV, Librosa, Transformers
