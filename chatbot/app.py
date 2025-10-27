# chatbot/app.py
import os
import uuid
from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
from datetime import timedelta
from chatbot_logic import handle_message, get_greeting_message

app = Flask(__name__, static_folder="static", template_folder="templates")

# --- Session config ---
app.secret_key = os.environ.get("CHATBOT_SECRET_KEY", "your-secret-key-change-this-in-production")
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = os.path.join(os.path.dirname(__file__), ".flask_session")
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
Session(app)


@app.route("/")
def index():
    # Generate or get session ID
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
    
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        user_message = (data.get("message") or "").strip()
        
        # Get session ID
        session_id = session.get('session_id', str(uuid.uuid4()))
        session['session_id'] = session_id
        
        # Handle the message using chatbot logic
        response_text, user_state, awaiting_variable = handle_message(user_message, session_id)
        
        return jsonify({
            "response": response_text,
            "session_id": session_id,
            "awaiting_variable": awaiting_variable
        })
        
    except Exception as e:
        print(f"[app.py] Error in chat endpoint: {e}")
        return jsonify({
            "response": "Sorry, I encountered an error. Please try again.",
            "error": str(e)
        }), 500


@app.route("/greeting")
def greeting():
    """Get initial greeting message"""
    try:
        greeting_msg = get_greeting_message()
        return jsonify({"greeting": greeting_msg})
    except Exception as e:
        print(f"[app.py] Error in greeting endpoint: {e}")
        return jsonify({"greeting": "Welcome to the Freelance Bid Prediction Chatbot!"})


@app.route("/status")
def status():
    """Get current status"""
    try:
        session_id = session.get('session_id', str(uuid.uuid4()))
        from utils.history_manager import get_user_history
        user_state = get_user_history(session_id)
        
        return jsonify({
            "session_id": session_id,
            "user_state": user_state
        })
    except Exception as e:
        print(f"[app.py] Error in status endpoint: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🤖 Starting Freelance Bid Prediction Chatbot...")
    print("📊 Loading ML model and dataset...")
    
    # Test model loading
    try:
        from ml_interface import load_model, load_dataset
        model = load_model()
        dataset = load_dataset()
        
        if model:
            print("✅ ML model loaded successfully")
        else:
            print("⚠️ ML model not found - predictions will be limited")
            
        if dataset is not None:
            print(f"✅ Dataset loaded successfully ({len(dataset)} rows)")
        else:
            print("⚠️ Dataset not found - suggestions will be limited")
            
    except Exception as e:
        print(f"⚠️ Error loading model/dataset: {e}")
    
    print("🚀 Server starting at http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
