# chatbot/main.py
import re
import os
import json
from difflib import get_close_matches
from datetime import datetime
from model_handler import predict_from_model, load_model, load_dataset

# FEATURES and categorical reference (case-sensitive)
FEATURES = [
    "Client_Budget_Min",
    "Client_Budget_Max",
    "Skills_Required",
    "Avg_Past_Bids",
    "Location",
    "Client_History",
    "Freelancer_Success_Rate",
    "Duration_Days",
    "Urgency",
    "Freelancer_Exp_Years",
    "Complexity",
    "Num_Bidders",
]

CATEGORIES = {
    "Skills_Required": ['Web Dev', 'Data Science', 'Graphic Design', 'Writing', 'Mobile Dev'],
    "Location": ['USA', 'India', 'Europe', 'Other'],
    "Client_History": ['New', 'Repeat'],
    "Urgency": ['Low', 'Normal', 'High'],
    "Complexity": ['Low', 'Medium', 'High'],
}

# history save dir
HISTORY_DIR = os.path.join(os.path.dirname(__file__), "user_history")
os.makedirs(HISTORY_DIR, exist_ok=True)


def save_history(session_id, conversation_history, user_state):
    try:
        safe = re.sub(r'[^a-zA-Z0-9_-]', '_', str(session_id))
        fname = os.path.join(HISTORY_DIR, f"{safe}_{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}.json")
        payload = {
            "session_id": session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "conversation_history": conversation_history,
            "user_state": user_state
        }
        with open(fname, "w", encoding="utf-8") as fh:
            json.dump(payload, fh, indent=2)
    except Exception as e:
        print(f"[main.save_history] {e}")

# ---------------- utility cleaners ----------------
def extract_number_from_text(text):
    if text is None:
        return None
    t = str(text).replace(',', '')
    m = re.search(r"(-?\d+(?:\.\d+)?)", t)
    return float(m.group(1)) if m else None

_FILLER_PATTERN = re.compile(r'\b(?:maybe|around|approximately|approx|about|roughly|i think|i\'m thinking|probably|not sure|kind of|kinda|value|years|yrs|yr)\b', flags=re.I)

def clean_user_value(value, expected_type, variable_name):
    """
    Returns (cleaned_value, ok (bool), message_if_any)
    """
    if value is None:
        return None, False, "No input."

    val = str(value).strip()
    # remove filler words
    val = _FILLER_PATTERN.sub(' ', val).strip()
    # collapse whitespace
    val = re.sub(r'\s+', ' ', val)

    if expected_type == "numeric":
        num = extract_number_from_text(val)
        if num is None:
            return None, False, "Couldn't find numeric value."
        # return int when possible
        if float(num).is_integer():
            return int(num), True, None
        return float(num), True, None

    if expected_type == "categorical":
        options = CATEGORIES.get(variable_name, [])
        cleaned = re.sub(r'[^A-Za-z0-9 ]+', ' ', val).strip()
        cleaned = re.sub(r'\s+', ' ', cleaned)
        if not options:
            # fallback: title-case the cleaned string
            return cleaned.title(), True, None
        # exact match case-insensitive
        for opt in options:
            if cleaned.lower() == opt.lower():
                return opt, True, None
        # close match
        lower_options = [o.lower() for o in options]
        matches = get_close_matches(cleaned.lower(), lower_options, n=1, cutoff=0.6)
        if matches:
            idx = lower_options.index(matches[0])
            return options[idx], True, None
        # token containment
        tokens = cleaned.lower().split()
        for opt in options:
            if any(tok in opt.lower() for tok in tokens):
                return opt, True, None
        return None, False, f"Unrecognized. Expected one of: {', '.join(options)}"
    # fallback
    return val, True, None

# ---------------- variable mapping ----------------
def find_variable_by_mention(text):
    if not text:
        return None
    t = text.lower()
    mapping = {
        "client_budget_min": "Client_Budget_Min",
        "client budget min": "Client_Budget_Min",
        "budget min": "Client_Budget_Min",
        "min budget": "Client_Budget_Min",
        "client_budget_max": "Client_Budget_Max",
        "client budget max": "Client_Budget_Max",
        "budget max": "Client_Budget_Max",
        "skills": "Skills_Required",
        "skills_required": "Skills_Required",
        "skill": "Skills_Required",
        "avg_past_bids": "Avg_Past_Bids",
        "average past bids": "Avg_Past_Bids",
        "avg past bids": "Avg_Past_Bids",
        "location": "Location",
        "client_history": "Client_History",
        "client history": "Client_History",
        "freelancer_success_rate": "Freelancer_Success_Rate",
        "success rate": "Freelancer_Success_Rate",
        "duration": "Duration_Days",
        "duration_days": "Duration_Days",
        "urgency": "Urgency",
        "freelancer_exp_years": "Freelancer_Exp_Years",
        "experience": "Freelancer_Exp_Years",
        "complexity": "Complexity",
        "num_bidders": "Num_Bidders",
        "bidders": "Num_Bidders",
        "number of bidders": "Num_Bidders",
    }
    for key, var in mapping.items():
        if key in t:
            return var
    for feat in FEATURES:
        if feat.lower() in t:
            return feat
    return None

def get_next_missing_variable(user_state):
    for feat in FEATURES:
        if feat not in user_state or user_state.get(feat) in [None, ""]:
            return feat
    return None

def count_filled(user_state):
    return sum(1 for f in FEATURES if user_state.get(f) not in [None, ""])

def build_status(user_state):
    filled = count_filled(user_state)
    missing = [f for f in FEATURES if user_state.get(f) in [None, ""]]
    current = {k: v for k, v in user_state.items() if k in FEATURES and v not in [None, ""]}
    return f"{filled}/{len(FEATURES)} filled. Missing: {', '.join(missing)}.", current

# ---------------- partial prediction helper ----------------
def partial_prediction_hint(user_state, top_n=5):
    """
    Use dataset to find matching rows for provided subset and, if model loaded, predict on them.
    Otherwise, return summary stats of numeric columns.
    """
    df = load_dataset()
    if df is None:
        return "Partial prediction not available (dataset missing)."

    # build mask for categorical equality for those provided
    mask = None
    provided = {}
    for k, v in user_state.items():
        if v not in [None, ""] and k in CATEGORIES:
            provided[k] = v
            if k in df.columns:
                cond = df[k].astype(str).str.lower() == str(v).lower()
                mask = cond if mask is None else (mask & cond)

    # for numeric provided, compute distance measure
    numeric_provided = {}
    for k, v in user_state.items():
        if v not in [None, ""] and k not in CATEGORIES:
            if k in df.columns:
                try:
                    numeric_provided[k] = float(v)
                except:
                    pass

    filtered = df[mask] if mask is not None else df.copy()

    if numeric_provided:
        # compute euclidean-like distance on common numeric columns
        common_nums = [c for c in numeric_provided.keys() if c in filtered.columns]
        if common_nums:
            import numpy as np
            def row_dist(r):
                s = 0.0
                for c in common_nums:
                    try:
                        s += (float(r[c]) - numeric_provided[c])**2
                    except:
                        s += 0.0
                return s
            filtered['__dist'] = filtered.apply(row_dist, axis=1)
            filtered = filtered.sort_values('__dist').drop(columns=['__dist'])
    # limit
    sample = filtered.head(top_n)
    # If model available, run predictions on these rows (if relevant features exist)
    model = load_model()
    if model is not None:
        try:
            # keep only FEATURES present in dataset
            cols = [c for c in FEATURES if c in sample.columns]
            if not cols:
                return "Not enough overlapping features with dataset for partial predictions."
            X = sample[cols]
            preds = model.predict(X)
            # present summary
            preds_list = [str(round(float(p), 3)) for p in preds]
            return f"Partial predictions on similar records (top {len(preds_list)}): {', '.join(preds_list)}"
        except Exception as e:
            return f"Partial prediction attempted but model failed: {e}"
    else:
        # no model: return basic numeric summaries of sample
        desc = sample.describe(include='all').to_json()
        return f"No model; sample rows from dataset:\n{sample.to_dict(orient='records')[:5]}"

# ---------------- main handler ----------------
def get_chatbot_response(user_input, user_state, awaiting_variable, conversation_history):
    # ensure keys present
    user_state = user_state or {}
    conversation_history = conversation_history or []
    for feat in FEATURES:
        user_state.setdefault(feat, "")

    # store user message
    conversation_history.append({"role": "user", "message": user_input, "timestamp": datetime.utcnow().isoformat()})

    # if empty message -> prompt next missing
    if not user_input:
        next_var = get_next_missing_variable(user_state)
        awaiting_variable = next_var
        if next_var:
            resp = f"Please enter value for {next_var}:"
        else:
            resp = "All fields seem filled. Type 'predict' to run model or 'status' to view filled fields."
        conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
        return resp, user_state, awaiting_variable, conversation_history

    low = user_input.strip().lower()

    # commands
    if low in ["status", "show status", "what's filled", "what is filled"]:
        status_msg, current = build_status(user_state)
        resp = f"{status_msg}\nCurrent values: {json.dumps(current)}"
        conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
        return resp, user_state, awaiting_variable, conversation_history

    if low in ["reset", "start over", "clear"]:
        # clear user_state and session
        for f in FEATURES:
            user_state[f] = ""
        awaiting_variable = None
        conversation_history.append({"role": "bot", "message": "State cleared. Starting over.", "timestamp": datetime.utcnow().isoformat()})
        next_var = get_next_missing_variable(user_state)
        awaiting_variable = next_var
        prompt = f"Please enter value for {next_var}:"
        conversation_history.append({"role": "bot", "message": prompt, "timestamp": datetime.utcnow().isoformat()})
        return prompt, user_state, awaiting_variable, conversation_history

    if low in ["predict", "run prediction", "run model", "predict anyway"]:
        # if not all provided, do partial prediction hint
        missing = [f for f in FEATURES if user_state.get(f) in [None, ""]]
        if missing:
            hint = partial_prediction_hint(user_state)
            conversation_history.append({"role": "bot", "message": hint, "timestamp": datetime.utcnow().isoformat()})
            return hint, user_state, awaiting_variable, conversation_history
        # else run full prediction
        model_input = {}
        for feat in FEATURES:
            model_input[feat] = user_state.get(feat)
        res = predict_from_model(model_input)
        if res.get("success"):
            resp = f"Based on your data, predicted value: {res.get('prediction')}"
        else:
            resp = f"Prediction failed: {res.get('message')}"
        conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
        # save history and reset
        save_history(session_id=datetime.utcnow().strftime("%Y%m%dT%H%M%S"), conversation_history=conversation_history, user_state=user_state)
        # reset state
        for f in FEATURES:
            user_state[f] = ""
        awaiting_variable = None
        return resp, user_state, awaiting_variable, conversation_history

    # detect if user explicitly mentions a variable
    mentioned = find_variable_by_mention(user_input)
    is_plain_number = re.fullmatch(r'\s*-?\d+(\.\d+)?\s*', user_input.strip()) is not None

    # If we are awaiting a variable
    if awaiting_variable:
        target = awaiting_variable
        # if user mentions a different var explicitly, accept that too
        if mentioned and mentioned != awaiting_variable:
            target = mentioned
        expected_type = "categorical" if target in CATEGORIES else "numeric"
        cleaned, ok, msg = clean_user_value(user_input, expected_type, target)
        if not ok:
            resp = f"I couldn't understand that for {target}. {msg} Please re-enter {target}:"
            conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
            return resp, user_state, awaiting_variable, conversation_history
        # accept and acknowledge
        user_state[target] = cleaned
        ack = f"Got it. {target} = {cleaned}"
        conversation_history.append({"role": "bot", "message": ack, "timestamp": datetime.utcnow().isoformat()})
        # if we filled the awaiting var, move to next missing
        if target == awaiting_variable:
            next_var = get_next_missing_variable(user_state)
            awaiting_variable = next_var
            if next_var:
                prompt = f"Now, please enter value for {next_var}:"
                conversation_history.append({"role": "bot", "message": prompt, "timestamp": datetime.utcnow().isoformat()})
                return f"{ack}\n{prompt}", user_state, awaiting_variable, conversation_history
            else:
                # all filled -> run model
                model_input = {f: user_state.get(f) for f in FEATURES}
                res = predict_from_model(model_input)
                if res.get("success"):
                    resp = f"All inputs received. Predicted output: {res.get('prediction')}"
                else:
                    resp = f"Prediction failed: {res.get('message')}"
                conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
                save_history(session_id=datetime.utcnow().strftime("%Y%m%dT%H%M%S"), conversation_history=conversation_history, user_state=user_state)
                # reset
                for f in FEATURES:
                    user_state[f] = ""
                awaiting_variable = None
                return resp, user_state, awaiting_variable, conversation_history
        else:
            # we set a different variable; keep awaiting_variable (unless now filled)
            next_var = get_next_missing_variable(user_state)
            awaiting_variable = next_var
            if next_var:
                prompt = f"Now, please enter value for {next_var}:"
                conversation_history.append({"role": "bot", "message": prompt, "timestamp": datetime.utcnow().isoformat()})
                return f"{ack}\n{prompt}", user_state, awaiting_variable, conversation_history
            else:
                # all filled
                model_input = {f: user_state.get(f) for f in FEATURES}
                res = predict_from_model(model_input)
                if res.get("success"):
                    resp = f"All inputs received. Predicted output: {res.get('prediction')}"
                else:
                    resp = f"Prediction failed: {res.get('message')}"
                conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
                save_history(session_id=datetime.utcnow().strftime("%Y%m%dT%H%M%S"), conversation_history=conversation_history, user_state=user_state)
                for f in FEATURES:
                    user_state[f] = ""
                awaiting_variable = None
                return resp, user_state, awaiting_variable, conversation_history

    # not awaiting; user might set a variable explicitly
    if mentioned:
        target = mentioned
        expected_type = "categorical" if target in CATEGORIES else "numeric"
        cleaned, ok, msg = clean_user_value(user_input, expected_type, target)
        if not ok:
            awaiting_variable = target
            resp = f"I couldn't interpret that for {target}. {msg} Please enter a valid value for {target}:"
            conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
            return resp, user_state, awaiting_variable, conversation_history
        user_state[target] = cleaned
        ack = f"Got it. {target} = {cleaned}"
        conversation_history.append({"role": "bot", "message": ack, "timestamp": datetime.utcnow().isoformat()})
        next_var = get_next_missing_variable(user_state)
        awaiting_variable = next_var
        if next_var:
            prompt = f"Now, please enter value for {next_var}:"
            conversation_history.append({"role": "bot", "message": prompt, "timestamp": datetime.utcnow().isoformat()})
            return f"{ack}\n{prompt}", user_state, awaiting_variable, conversation_history
        else:
            model_input = {f: user_state.get(f) for f in FEATURES}
            res = predict_from_model(model_input)
            if res.get("success"):
                resp = f"All inputs received. Predicted output: {res.get('prediction')}"
            else:
                resp = f"Prediction failed: {res.get('message')}"
            conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
            save_history(session_id=datetime.utcnow().strftime("%Y%m%dT%H%M%S"), conversation_history=conversation_history, user_state=user_state)
            for f in FEATURES:
                user_state[f] = ""
            awaiting_variable = None
            return resp, user_state, awaiting_variable, conversation_history

    # if user typed plain number and nothing is awaiting, treat it as value for next missing
    if re.fullmatch(r'\s*-?\d+(\.\d+)?\s*', user_input.strip()):
        next_var = get_next_missing_variable(user_state)
        if not next_var:
            resp = "All fields are filled. Type 'predict' to run model or 'status' to view fields."
            conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
            return resp, user_state, awaiting_variable, conversation_history
        expected_type = "categorical" if next_var in CATEGORIES else "numeric"
        cleaned, ok, msg = clean_user_value(user_input, expected_type, next_var)
        if not ok:
            awaiting_variable = next_var
            resp = f"Couldn't interpret value for {next_var}. {msg} Please enter a valid {next_var}:"
            conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
            return resp, user_state, awaiting_variable, conversation_history
        user_state[next_var] = cleaned
        ack = f"Got it. {next_var} = {cleaned}"
        conversation_history.append({"role": "bot", "message": ack, "timestamp": datetime.utcnow().isoformat()})
        nxt = get_next_missing_variable(user_state)
        awaiting_variable = nxt
        if nxt:
            prompt = f"Now, please enter value for {nxt}:"
            conversation_history.append({"role": "bot", "message": prompt, "timestamp": datetime.utcnow().isoformat()})
            return f"{ack}\n{prompt}", user_state, awaiting_variable, conversation_history
        else:
            model_input = {f: user_state.get(f) for f in FEATURES}
            res = predict_from_model(model_input)
            if res.get("success"):
                resp = f"All inputs received. Predicted output: {res.get('prediction')}"
            else:
                resp = f"Prediction failed: {res.get('message')}"
            conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
            save_history(session_id=datetime.utcnow().strftime("%Y%m%dT%H%M%S"), conversation_history=conversation_history, user_state=user_state)
            for f in FEATURES:
                user_state[f] = ""
            awaiting_variable = None
            return resp, user_state, awaiting_variable, conversation_history

    # fallback: start guided flow
    next_var = get_next_missing_variable(user_state)
    awaiting_variable = next_var
    if next_var:
        resp = f"I didn't catch that. Let's continue. Please enter value for {next_var}:"
    else:
        resp = "All fields are filled. Type 'predict' to run model."
    conversation_history.append({"role": "bot", "message": resp, "timestamp": datetime.utcnow().isoformat()})
    return resp, user_state, awaiting_variable, conversation_history
