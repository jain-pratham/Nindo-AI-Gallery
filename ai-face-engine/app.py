from fastapi import FastAPI
from pydantic import BaseModel
from deepface import DeepFace
import numpy as np
import requests
import tempfile
import os
import tensorflow as tf
import threading
import uvicorn

# -----------------------------
# TensorFlow Stability
# -----------------------------
tf.config.threading.set_inter_op_parallelism_threads(1)
tf.config.threading.set_intra_op_parallelism_threads(1)

app = FastAPI()

MODEL_NAME = "Facenet512"
THRESHOLD = 0.55

lock = threading.Lock()

# -----------------------------
# Load model once
# -----------------------------
print("Loading FaceNet model...")
DeepFace.build_model(MODEL_NAME)
print("Model loaded successfully!")

# -----------------------------
# Request Models
# -----------------------------

class EmbeddingRequest(BaseModel):
    imageUrl: str

class MatchRequest(BaseModel):
    selfieEmbedding: list
    galleryEmbeddings: list


# -----------------------------
# Utils
# -----------------------------

def download_image(url):
    response = requests.get(url, timeout=15)
    if response.status_code != 200:
        raise Exception("Image download failed")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(response.content)
        return tmp.name


def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


# -----------------------------
# Generate Embedding (SAFE)
# -----------------------------
@app.post("/generate-embedding")
def generate_embedding(data: EmbeddingRequest):
    try:
        tmp_path = download_image(data.imageUrl)

        with lock:
            embedding = DeepFace.represent(
                img_path=tmp_path,
                model_name=MODEL_NAME,
                enforce_detection=False,
                detector_backend="opencv"
            )[0]["embedding"]

        os.remove(tmp_path)

        return {"embedding": embedding}

    except Exception as e:
        return {"error": str(e)}


# -----------------------------
# Match Using VECTORS ONLY
# -----------------------------
@app.post("/match")
def match_faces(data: MatchRequest):
    try:
        matched = []

        for item in data.galleryEmbeddings:
            score = cosine_similarity(
                data.selfieEmbedding,
                item["embedding"]
            )

            if score > THRESHOLD:
                matched.append({
                    "imageUrl": item["imageUrl"],
                    "score": score
                })

        return {"matchedPhotos": matched}

    except Exception as e:
        return {"error": str(e)}


# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, workers=1)
