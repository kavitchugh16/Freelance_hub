Readme

# 🧠 Hybrid Chatbot System (Rule-Based + ML)

## ⚙️ Overview
This chatbot combines **rule-based logic** and **machine learning** for smart, guided conversations.  
It is built with **Flask (Python)** and includes a modular structure for rule logic, ML integration, and chat history.

---

## 🪟 Setup Guide (Windows)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/Freelance_hub.git
cd Freelance_hub/chatbot


Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate


Install dependencies
pip install -r requirements.txt

Run the chatbot server
python app.py


http://127.0.0.1:5000


Clean Setup (if environment breaks)
rmdir /s /q .venv
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
