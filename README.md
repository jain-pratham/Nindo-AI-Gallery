# 💍 Nindo AI Wedding Gallery

An AI-powered wedding gallery system that automatically matches user selfies with event photos using facial recognition.

Built with modern full-stack technologies:

- ⚡ Next.js (Frontend)
- 🚀 FastAPI (Backend)
- 🧠 DeepFace (Face Recognition)
- 🔢 TensorFlow (Embedding Model)
- 🧮 NumPy (Vector Similarity)

---

## 📌 Project Overview

Nindo AI Wedding Gallery allows users to:

1️⃣ Upload a selfie  
2️⃣ Generate a 512-dimension face embedding  
3️⃣ Compare it with stored gallery embeddings  
4️⃣ Instantly retrieve matched wedding photos  

The system uses cosine similarity on FaceNet512 embeddings for accurate and efficient face matching.

---

## 🏗️ Project Structure

```
Nindo-AI-Gallery/
│
├── ai-wedding-gallery/     # Next.js Frontend
│
├── ai-face-engine/         # FastAPI Backend
│   └── app.py              # Main API server
│
└── README.md
```

---

## 🧠 Face Recognition Architecture

```
User Selfie
      ↓
Generate Embedding (FaceNet512)
      ↓
Compare with Gallery Embeddings
      ↓
Cosine Similarity Calculation
      ↓
Return Matched Photos
```

---

## ⚙️ Backend (FastAPI + DeepFace)

### 🔹 Model Used
- FaceNet512
- Cosine similarity threshold: **0.55**

---

### 📡 API Endpoints

### 1️⃣ Generate Embedding

**POST** `/generate-embedding`

Request:
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

Response:
```json
{
  "embedding": [ ...512 values... ]
}
```

---

### 2️⃣ Match Faces

**POST** `/match`

Request:
```json
{
  "selfieEmbedding": [...],
  "galleryEmbeddings": [
    {
      "imageUrl": "https://...",
      "embedding": [...]
    }
  ]
}
```

Response:
```json
{
  "matchedPhotos": [
    {
      "imageUrl": "...",
      "score": 0.82
    }
  ]
}
```

---

## 🚀 Local Setup Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/Nindo-AI-Gallery.git
cd Nindo-AI-Gallery
```

---

### 2️⃣ Backend Setup (FastAPI)

```bash
cd ai-face-engine
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

### 3️⃣ Frontend Setup (Next.js)

```bash
cd ai-wedding-gallery
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🌍 Deployment

### Frontend:
Deploy on **Vercel**

### Backend:
Deploy on **Render / Railway / AWS EC2**

⚠ Note: TensorFlow-based backend may have cold start delays on free hosting plans.

---

## 🧮 Matching Logic

Cosine Similarity Formula:

```
similarity = dot(A, B) / (||A|| * ||B||)
```

Decision Rule:

```
If score > 0.55 → Match
Else → No Match
```

---

## 🔒 Important Notes

- Virtual environments are excluded from Git.
- node_modules are excluded from Git.
- Only `app.py` is included from backend directory.
- Temporary files are auto-deleted after embedding generation.
- Model loads once at server startup for better performance.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|----------|
| Next.js | Frontend UI |
| FastAPI | REST API |
| DeepFace | Face Embeddings |
| TensorFlow | ML Backend |
| NumPy | Vector Math |
| Uvicorn | ASGI Server |

---

## 📈 Future Improvements

- GPU acceleration
- FAISS integration for large-scale matching
- MongoDB embedding storage
- Batch processing optimization
- Docker containerization
- Authentication & user accounts

---

## 👨‍💻 Author

Pratham Jain  
AI & Full Stack Developer  

---

## 📜 License

This project is for educational and demonstration purposes.
