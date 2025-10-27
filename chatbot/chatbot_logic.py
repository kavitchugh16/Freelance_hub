# chatbot/chatbot_logic.py
import re
import difflib
from datetime import datetime
from utils.history_manager import save_user_input, get_user_history, save_conversation, clear_history
from ml_interface import predict_from_model, get_model_features, suggest_outcomes

# Model features and validation rules
FEATURES = get_model_features()

# Categorical variables with their valid options
CATEGORIES = {
    "Skills_Required": ['Web Dev', 'Data Science', 'Graphic Design', 'Writing', 'Mobile Dev', 'Marketing', 'Other'],
    "Location": ['USA', 'India', 'Europe', 'Other'],
    "Client_History": ['New', 'Repeat'],
    "Urgency": ['Low', 'Normal', 'High'],
    "Complexity": ['Low', 'Medium', 'High'],
}

# Variable-specific warning messages
WARNING_MESSAGES = {
    "Client_Budget_Min": "⚠️ The minimum budget value seems invalid. Please enter a positive numeric value.",
    "Client_Budget_Max": "⚠️ The maximum budget value seems invalid. Please enter a positive numeric value greater than minimum budget.",
    "Skills_Required": "⚠️ Invalid skill category. Please choose from: Web Dev, Data Science, Graphic Design, Writing, Mobile Dev, Marketing, or Other.",
    "Avg_Past_Bids": "⚠️ The average past bids value seems out of range. Please enter a positive numeric value.",
    "Location": "⚠️ Invalid location. Please choose from: USA, India, Europe, or Other.",
    "Client_History": "⚠️ Invalid client history. Please choose: New or Repeat.",
    "Freelancer_Success_Rate": "⚠️ Success rate should be between 0 and 100. Please enter a valid percentage.",
    "Duration_Days": "⚠️ Duration should be a positive number of days. Please enter a valid value.",
    "Urgency": "⚠️ Invalid urgency level. Please choose: Low, Normal, or High.",
    "Freelancer_Exp_Years": "⚠️ Experience years should be a positive number. Please enter a valid value.",
    "Complexity": "⚠️ Invalid complexity level. Please choose: Low, Medium, or High.",
    "Num_Bidders": "⚠️ Number of bidders should be a positive integer. Please enter a valid value.",
}

def extract_number_from_text(text):
    """Extract numeric value from text"""
    if text is None:
        return None
    text = str(text).replace(',', '')
    match = re.search(r"(-?\d+(?:\.\d+)?)", text)
    return float(match.group(1)) if match else None

def clean_user_value(value, expected_type, variable_name):
    """
    Clean and validate user input
    Returns: (cleaned_value, is_valid, error_message)
    """
    if value is None or str(value).strip() == "":
        return None, False, "No input provided."
    
    val = str(value).strip()
    
    # Remove common filler words
    filler_pattern = re.compile(r'\b(?:maybe|around|approximately|approx|about|roughly|i think|i\'m thinking|probably|not sure|kind of|kinda|value|years|yrs|yr)\b', flags=re.I)
    val = filler_pattern.sub(' ', val).strip()
    val = re.sub(r'\s+', ' ', val)
    
    if expected_type == "numeric":
        num = extract_number_from_text(val)
        if num is None:
            return None, False, "Could not extract numeric value."
        
        # Additional validation for specific variables
        if variable_name == "Freelancer_Success_Rate" and (num < 0 or num > 100):
            return None, False, "Success rate must be between 0 and 100."
        
        if variable_name in ["Client_Budget_Min", "Client_Budget_Max", "Avg_Past_Bids", "Duration_Days", "Freelancer_Exp_Years"] and num < 0:
            return None, False, "Value must be positive."
        
        if variable_name == "Num_Bidders" and (num < 0 or not float(num).is_integer()):
            return None, False, "Number of bidders must be a positive integer."
        
        # Return integer if possible
        if float(num).is_integer():
            return int(num), True, None
        return float(num), True, None
    
    elif expected_type == "categorical":
        options = CATEGORIES.get(variable_name, [])
        cleaned = re.sub(r'[^A-Za-z0-9 ]+', ' ', val).strip()
        cleaned = re.sub(r'\s+', ' ', cleaned)
        
        if not options:
            return cleaned.title(), True, None
        
        # Exact match (case-insensitive)
        for option in options:
            if cleaned.lower() == option.lower():
                return option, True, None
        
        # Close match using difflib
        lower_options = [opt.lower() for opt in options]
        matches = difflib.get_close_matches(cleaned.lower(), lower_options, n=1, cutoff=0.6)
        if matches:
            idx = lower_options.index(matches[0])
            return options[idx], True, None
        
        # Token containment
        tokens = cleaned.lower().split()
        for option in options:
            if any(token in option.lower() for token in tokens):
                return option, True, None
        
        return None, False, f"Invalid option. Expected one of: {', '.join(options)}"
    
    return val, True, None

def find_variable_by_mention(text):
    """Find which variable the user is referring to"""
    if not text:
        return None
    
    text_lower = text.lower()
    
    # Variable name mappings
    mappings = {
        "client_budget_min": "Client_Budget_Min",
        "client budget min": "Client_Budget_Min",
        "budget min": "Client_Budget_Min",
        "min budget": "Client_Budget_Min",
        "minimum budget": "Client_Budget_Min",
        "client_budget_max": "Client_Budget_Max",
        "client budget max": "Client_Budget_Max",
        "budget max": "Client_Budget_Max",
        "max budget": "Client_Budget_Max",
        "maximum budget": "Client_Budget_Max",
        "skills": "Skills_Required",
        "skills_required": "Skills_Required",
        "skill": "Skills_Required",
        "avg_past_bids": "Avg_Past_Bids",
        "average past bids": "Avg_Past_Bids",
        "avg past bids": "Avg_Past_Bids",
        "past bids": "Avg_Past_Bids",
        "location": "Location",
        "client_history": "Client_History",
        "client history": "Client_History",
        "history": "Client_History",
        "freelancer_success_rate": "Freelancer_Success_Rate",
        "success rate": "Freelancer_Success_Rate",
        "success": "Freelancer_Success_Rate",
        "duration": "Duration_Days",
        "duration_days": "Duration_Days",
        "days": "Duration_Days",
        "urgency": "Urgency",
        "freelancer_exp_years": "Freelancer_Exp_Years",
        "experience": "Freelancer_Exp_Years",
        "exp years": "Freelancer_Exp_Years",
        "years": "Freelancer_Exp_Years",
        "complexity": "Complexity",
        "num_bidders": "Num_Bidders",
        "bidders": "Num_Bidders",
        "number of bidders": "Num_Bidders",
        "bidders count": "Num_Bidders",
    }
    
    # Check mappings
    for key, variable in mappings.items():
        if key in text_lower:
            return variable
    
    # Check direct feature names
    for feature in FEATURES:
        if feature.lower() in text_lower:
            return feature
    
    return None

def get_next_missing_variable(user_state):
    """Get the next variable that needs to be filled"""
    for feature in FEATURES:
        if feature not in user_state or user_state.get(feature) in [None, ""]:
            return feature
    return None

def count_filled_variables(user_state):
    """Count how many variables have been filled"""
    return sum(1 for feature in FEATURES if user_state.get(feature) not in [None, ""])

def build_status_message(user_state):
    """Build status message showing progress"""
    filled = count_filled_variables(user_state)
    total = len(FEATURES)
    missing = [f for f in FEATURES if user_state.get(f) in [None, ""]]
    
    status = f"Progress: {filled}/{total} variables filled."
    if missing:
        status += f" Still need: {', '.join(missing[:3])}"
        if len(missing) > 3:
            status += f" and {len(missing) - 3} more."
    
    return status

def handle_message(message, session_id):
    """
    Main message handler for the chatbot
    Returns: (response_text, updated_user_state, updated_awaiting_variable)
    """
    # Get current user state
    user_state = get_user_history(session_id)
    
    # Save user message to conversation
    save_conversation(session_id, "user", message)
    
    # Handle empty message
    if not message or not message.strip():
        next_var = get_next_missing_variable(user_state)
        if next_var:
            response = f"Please enter a value for **{next_var}**:"
        else:
            response = "All variables are filled! Type 'predict' to run the model or 'status' to see current values."
        save_conversation(session_id, "bot", response)
        return response, user_state, next_var
    
    message_lower = message.strip().lower()
    
    # Handle commands
    if message_lower in ["status", "show status", "what's filled", "what is filled"]:
        status = build_status_message(user_state)
        filled_vars = {k: v for k, v in user_state.items() if v not in [None, ""]}
        response = f"{status}\n\nCurrent values:\n" + "\n".join([f"• {k}: {v}" for k, v in filled_vars.items()])
        save_conversation(session_id, "bot", response)
        return response, user_state, None
    
    if message_lower in ["reset", "start over", "clear", "restart"]:
        clear_history(session_id)
        user_state = {}
        next_var = get_next_missing_variable(user_state)
        response = "🔄 Session reset! Let's start fresh.\n\n" + get_greeting_message()
        save_conversation(session_id, "bot", response)
        return response, user_state, next_var
    
    if message_lower in ["predict", "run prediction", "run model", "predict anyway"]:
        missing = [f for f in FEATURES if user_state.get(f) in [None, ""]]
        
        if missing:
            # Partial prediction
            suggestions = suggest_outcomes(user_state)
            response = f"⚠️ Missing {len(missing)} variables: {', '.join(missing)}\n\n{suggestions}\n\nPlease fill all variables for accurate prediction."
        else:
            # Full prediction
            result = predict_from_model(user_state)
            if result["success"]:
                response = f"🎯 **Prediction Result:** {result['prediction']:.2f}\n\nAll variables collected successfully!"
            else:
                response = f"❌ Prediction failed: {result['message']}"
        
        save_conversation(session_id, "bot", response)
        return response, user_state, None
    
    # Check if user mentioned a specific variable
    mentioned_var = find_variable_by_mention(message)
    
    # Determine target variable
    if mentioned_var:
        target_var = mentioned_var
    else:
        # Check if we have a current awaiting variable
        current_awaiting = get_next_missing_variable(user_state)
        if current_awaiting:
            target_var = current_awaiting
        else:
            # All filled, ask what they want to do
            response = "All variables are filled! Type 'predict' to run the model, 'status' to see values, or 'reset' to start over."
            save_conversation(session_id, "bot", response)
            return response, user_state, None
    
    # Validate and clean the input
    expected_type = "categorical" if target_var in CATEGORIES else "numeric"
    cleaned_value, is_valid, error_msg = clean_user_value(message, expected_type, target_var)
    
    if not is_valid:
        warning = WARNING_MESSAGES.get(target_var, f"Invalid input for {target_var}.")
        response = f"{warning}\n\nPlease try again:"
        save_conversation(session_id, "bot", response)
        return response, user_state, target_var
    
    # Save the valid input
    save_user_input(session_id, target_var, cleaned_value)
    user_state[target_var] = cleaned_value
    
    # Acknowledge the input
    response = f"✅ Got it! **{target_var}** = {cleaned_value}"
    
    # Check if all variables are filled
    next_var = get_next_missing_variable(user_state)
    if next_var:
        response += f"\n\nNext, please enter a value for **{next_var}**:"
    else:
        response += "\n\n🎉 All variables collected! Type 'predict' to run the model."
    
    save_conversation(session_id, "bot", response)
    return response, user_state, next_var

def get_greeting_message():
    """Get the initial greeting message"""
    return f"""🤖 **Welcome to the Freelance Bid Prediction Chatbot!**

I'll help you predict freelance bid outcomes by collecting information about your project.

**Required Variables ({len(FEATURES)} total):**
{chr(10).join([f"• {feature}" for feature in FEATURES])}

Let's start! Please enter a value for **{FEATURES[0]}**:"""
