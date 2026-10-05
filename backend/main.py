from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "openai/gpt-oss-20b"


@app.route("/api/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        cv_text = data.get("cv_text", "")

        if not cv_text:
            return jsonify({"error": "CV text is required"}), 400

        api_key = os.environ.get("GROQ_API_KEY")

        if not api_key:
            return jsonify({"error": "GROQ_API_KEY is not configured"}), 500

        response = requests.post(
            GROQ_API_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            },
            json={
                "model": GROQ_MODEL,
                "messages": [
                    {
                        "role": "user",
                        "content": cv_text
                    }
                ],
                "temperature": 0.3,
                "max_tokens": 2500
            },
            timeout=120
        )

        return jsonify(response.json()), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return "CV Analyzer Backend is running!"


if __name__ == "__main__":
    app.run(debug=True)