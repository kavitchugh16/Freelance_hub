# chatbot/ml_interface.py
import os
import joblib
import pandas as pd
import numpy as np

# Paths
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "model_pipeline.pkl")
CSV_PATH = os.path.join(BASE_DIR, "..", "models", "freelance_bids_dataset_10000.csv")

# Global variables for caching
_model = None
_dataset = None
_feature_order = None

def load_model():
    """Load the ML model from pickle file"""
    global _model, _feature_order
    if _model is not None:
        return _model
    
    if not os.path.exists(MODEL_PATH):
        print(f"[ml_interface] Model file not found at: {MODEL_PATH}")
        return None
    
    try:
        _model = joblib.load(MODEL_PATH)
        # Try to get feature order from the model
        _feature_order = getattr(_model, "feature_names_in_", None)
        print(f"[ml_interface] Model loaded successfully")
        return _model
    except Exception as e:
        print(f"[ml_interface] Failed to load model: {e}")
        _model = None
        return None

def load_dataset():
    """Load the dataset from CSV file"""
    global _dataset
    if _dataset is not None:
        return _dataset
    
    if not os.path.exists(CSV_PATH):
        print(f"[ml_interface] Dataset file not found at: {CSV_PATH}")
        return None
    
    try:
        _dataset = pd.read_csv(CSV_PATH)
        print(f"[ml_interface] Dataset loaded successfully with {len(_dataset)} rows")
        return _dataset
    except Exception as e:
        print(f"[ml_interface] Failed to load dataset: {e}")
        _dataset = None
        return None

def get_model_features():
    """
    Get list of model input variables
    Returns list of feature names
    """
    model = load_model()
    if model is None:
        # Fallback to common features if model not available
        return [
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
            "Num_Bidders"
        ]
    
    # Try to get feature names from model
    if hasattr(model, 'feature_names_in_'):
        return list(model.feature_names_in_)
    elif hasattr(model, 'get_feature_names'):
        return list(model.get_feature_names())
    else:
        # Fallback
        return [
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
            "Num_Bidders"
        ]

def predict_from_model(input_dict):
    """
    Make prediction using the loaded model
    input_dict: dictionary with feature names as keys and values
    Returns: dict with 'success', 'prediction' or 'message'
    """
    model = load_model()
    if model is None:
        return {"success": False, "message": "Model not available"}
    
    try:
        # Create DataFrame from input dictionary
        df = pd.DataFrame([input_dict])
        
        # Reorder columns if model expects specific order
        if _feature_order is not None:
            available_features = [f for f in _feature_order if f in df.columns]
            df = df[available_features]
        
        # Make prediction
        prediction = model.predict(df)
        
        # Handle different prediction formats
        if hasattr(prediction, '__len__') and len(prediction) > 0:
            pred_value = prediction[0]
        else:
            pred_value = prediction
        
        return {"success": True, "prediction": float(pred_value)}
        
    except Exception as e:
        return {"success": False, "message": f"Prediction error: {str(e)}"}

def suggest_outcomes(partial_input_dict):
    """
    Use dataset to suggest possible outcomes based on partial inputs
    partial_input_dict: dictionary with some feature values
    Returns: string with suggestions
    """
    dataset = load_dataset()
    if dataset is None:
        return "Dataset not available for suggestions"
    
    try:
        # Filter dataset based on categorical matches
        filtered_df = dataset.copy()
        
        # Apply categorical filters
        for feature, value in partial_input_dict.items():
            if feature in dataset.columns and value is not None:
                if dataset[feature].dtype == 'object':  # Categorical
                    filtered_df = filtered_df[filtered_df[feature].astype(str).str.lower() == str(value).lower()]
                else:  # Numeric - find similar values
                    try:
                        num_value = float(value)
                        # Find values within 20% range
                        tolerance = abs(num_value) * 0.2
                        filtered_df = filtered_df[
                            (filtered_df[feature] >= num_value - tolerance) & 
                            (filtered_df[feature] <= num_value + tolerance)
                        ]
                    except:
                        continue
        
        if len(filtered_df) == 0:
            return "No similar records found in dataset"
        
        # Get statistics for numeric columns
        numeric_cols = filtered_df.select_dtypes(include=[np.number]).columns
        suggestions = []
        
        if len(numeric_cols) > 0:
            stats = filtered_df[numeric_cols].describe()
            for col in numeric_cols[:5]:  # Limit to first 5 numeric columns
                mean_val = stats.loc['mean', col]
                suggestions.append(f"{col}: avg {mean_val:.2f}")
        
        # Get most common categorical values
        categorical_cols = filtered_df.select_dtypes(include=['object']).columns
        for col in categorical_cols[:3]:  # Limit to first 3 categorical columns
            if col in filtered_df.columns:
                most_common = filtered_df[col].value_counts().head(3)
                if len(most_common) > 0:
                    suggestions.append(f"{col}: {', '.join([f'{val}({count})' for val, count in most_common.items()])}")
        
        if suggestions:
            return f"Based on {len(filtered_df)} similar records: " + "; ".join(suggestions)
        else:
            return f"Found {len(filtered_df)} similar records but no clear patterns"
            
    except Exception as e:
        return f"Error generating suggestions: {str(e)}"

def get_dataset_sample(n=5):
    """
    Get a sample of the dataset for reference
    """
    dataset = load_dataset()
    if dataset is None:
        return None
    
    return dataset.head(n).to_dict('records')
