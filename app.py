from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import os
import pandas as pd
from dotenv import load_dotenv
import json
from datetime import datetime
from collections import defaultdict


TRUE_FILE = os.path.join('dataset', 'True.csv')
FAKE_FILE = os.path.join('dataset', 'Fake.csv')


load_dotenv() 
gemini_api_key = os.environ.get("GEMINI_API_KEY")
if not gemini_api_key:
    raise RuntimeError("GEMINI_API_KEY environment variable not set. Please set it before running the app.")
genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel("gemini-2.0-flash")

app = Flask(__name__)


def clean_text(text):
    return text.strip().lower()


def get_headlines_from_csv(filepath):
    if not os.path.exists(filepath):
        return []
    df = pd.read_csv(filepath)
    if df.empty:
        return []

    first_col = df.columns[0]
    return df[first_col].dropna().apply(clean_text).tolist()


def check_existing_article(news_text):
    cleaned_input = clean_text(news_text)
    true_headlines = get_headlines_from_csv(TRUE_FILE)
    if cleaned_input in true_headlines:
        return "Real"

    fake_headlines = get_headlines_from_csv(FAKE_FILE)
    if cleaned_input in fake_headlines:
        return "Fake"

    return None

feedback_counts = {
    'positive': 0,
    'negative': 0
}


try:
    with open('feedback_counts.json', 'r') as f:
        feedback_counts = json.load(f)
except FileNotFoundError:
    pass

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/tech')
def tech():
    return render_template('tech.html')

@app.route('/aboutProject')
def aboutProject():
    return render_template('aboutProject.html')

@app.route('/aboutTeam')
def aboutTeam():
    return render_template('aboutTeam.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        news_text = data.get("text", "").strip()

        if not news_text:
            return jsonify({"error": "Please enter some news text!"}), 400

        
        existing_result = check_existing_article(news_text)
        if existing_result:
            return jsonify({"prediction": f"Already classified as {existing_result}"}), 200

    
        response = model.generate_content(
            f"Classify this news as Real or Fake: {news_text}. Respond only with 'Fake' or 'Real'."
        )

        print("Response:", response.text)
        prediction = response.text.strip().lower()

        cleaned_text = news_text.strip()

        if "fake" in prediction:
            result = "Fake"
            df = pd.read_csv(FAKE_FILE) if os.path.exists(FAKE_FILE) else pd.DataFrame(columns=['news'])
            df = pd.concat([df, pd.DataFrame([{'news': cleaned_text}])], ignore_index=True)
            df.to_csv(FAKE_FILE, index=False)

        elif "real" in prediction:
            result = "Real"
            df = pd.read_csv(TRUE_FILE) if os.path.exists(TRUE_FILE) else pd.DataFrame(columns=['news'])
            df = pd.concat([df, pd.DataFrame([{'news': cleaned_text}])], ignore_index=True)
            df.to_csv(TRUE_FILE, index=False)

        else:
            result = "Unknown"

        return jsonify({"prediction": result})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/feedback', methods=['POST'])
def feedback():
    try:
        data = request.get_json()
        feedback_type = data.get('feedback')
        
        
        feedback_counts[feedback_type] += 1
        
    
        with open('feedback_counts.json', 'w') as f:
            json.dump(feedback_counts, f)
        
        
        feedback_data = {
            'feedback': feedback_type,
            'prediction': data.get('prediction'),
            'news_text': data.get('newsText'),
            'timestamp': datetime.now().isoformat()
        }
        
        with open('feedback.json', 'a') as f:
            f.write(json.dumps(feedback_data) + '\n')
        
        return jsonify({
            'status': 'success',
            'counts': feedback_counts
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/feedback/stats', methods=['GET'])
def get_feedback_stats():
    return jsonify(feedback_counts)

if __name__ == '__main__':
    app.run(debug=True)
