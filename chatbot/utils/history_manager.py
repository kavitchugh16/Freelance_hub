# chatbot/utils/history_manager.py
import os
import json
from datetime import datetime
import re

# Create history directory
HISTORY_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "history")
os.makedirs(HISTORY_DIR, exist_ok=True)

def save_user_input(session_id, variable, value):
    """
    Save user input for a specific variable in the session history
    """
    try:
        safe_session_id = re.sub(r'[^a-zA-Z0-9_-]', '_', str(session_id))
        history_file = os.path.join(HISTORY_DIR, f"{safe_session_id}.json")
        
        # Load existing history or create new
        if os.path.exists(history_file):
            with open(history_file, 'r', encoding='utf-8') as f:
                history = json.load(f)
        else:
            history = {
                "session_id": session_id,
                "created_at": datetime.utcnow().isoformat(),
                "inputs": {},
                "conversation": []
            }
        
        # Update inputs
        history["inputs"][variable] = value
        history["last_updated"] = datetime.utcnow().isoformat()
        
        # Save back to file
        with open(history_file, 'w', encoding='utf-8') as f:
            json.dump(history, f, indent=2)
            
        return True
    except Exception as e:
        print(f"[history_manager] Error saving input: {e}")
        return False

def get_user_history(session_id):
    """
    Get all collected inputs for a session
    Returns dictionary of collected inputs
    """
    try:
        safe_session_id = re.sub(r'[^a-zA-Z0-9_-]', '_', str(session_id))
        history_file = os.path.join(HISTORY_DIR, f"{safe_session_id}.json")
        
        if os.path.exists(history_file):
            with open(history_file, 'r', encoding='utf-8') as f:
                history = json.load(f)
                return history.get("inputs", {})
        return {}
    except Exception as e:
        print(f"[history_manager] Error loading history: {e}")
        return {}

def save_conversation(session_id, role, message):
    """
    Save conversation message to history
    """
    try:
        safe_session_id = re.sub(r'[^a-zA-Z0-9_-]', '_', str(session_id))
        history_file = os.path.join(HISTORY_DIR, f"{safe_session_id}.json")
        
        # Load existing history or create new
        if os.path.exists(history_file):
            with open(history_file, 'r', encoding='utf-8') as f:
                history = json.load(f)
        else:
            history = {
                "session_id": session_id,
                "created_at": datetime.utcnow().isoformat(),
                "inputs": {},
                "conversation": []
            }
        
        # Add conversation message
        history["conversation"].append({
            "role": role,
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        })
        history["last_updated"] = datetime.utcnow().isoformat()
        
        # Save back to file
        with open(history_file, 'w', encoding='utf-8') as f:
            json.dump(history, f, indent=2)
            
        return True
    except Exception as e:
        print(f"[history_manager] Error saving conversation: {e}")
        return False

def clear_history(session_id):
    """
    Clear history for a session
    """
    try:
        safe_session_id = re.sub(r'[^a-zA-Z0-9_-]', '_', str(session_id))
        history_file = os.path.join(HISTORY_DIR, f"{safe_session_id}.json")
        
        if os.path.exists(history_file):
            os.remove(history_file)
            return True
        return False
    except Exception as e:
        print(f"[history_manager] Error clearing history: {e}")
        return False

def get_full_history(session_id):
    """
    Get complete history including conversation
    """
    try:
        safe_session_id = re.sub(r'[^a-zA-Z0-9_-]', '_', str(session_id))
        history_file = os.path.join(HISTORY_DIR, f"{safe_session_id}.json")
        
        if os.path.exists(history_file):
            with open(history_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return None
    except Exception as e:
        print(f"[history_manager] Error loading full history: {e}")
        return None
