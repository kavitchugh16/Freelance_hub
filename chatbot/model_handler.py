# chatbot/model_handler.py
import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "model_pipeline.pkl")
CSV_PATH = os.path.join(BASE_DIR, "models", "freelance_bids_dataset_10000.csv")

_model = None
_feature_order = None

def load_model():
    global _model, _feature_order
    if _model is not None:
        return _model
    if not os.path.exists(MODEL_PATH):
        _model = None
        return None
    try:
        _model = joblib.load(MODEL_PATH)
        # Try to infer feature order
        _feature_order = getattr(_model, "feature_names_in_", None)
        return _model
    except Exception as e:
        print(f"[model_handler] Failed to load model: {e}")
        _model = None
        return None

def predict_from_model(input_dict):
    """
    input_dict: {feature_name: value}
    Returns: dict with keys 'success' (bool), 'prediction' or 'message'
    """
    model = load_model()
    if model is None:
        return {"success": False, "message": "Model not found."}
    try:
        import pandas as pd
        df = pd.DataFrame([input_dict])
        # reorder if model expects certain order
        if _feature_order is not None:
            cols = [c for c in _feature_order if c in df.columns]
            df = df[cols]
        pred = model.predict(df)
        if hasattr(pred, "__len__"):
            pred_val = pred[0]
        else:
            pred_val = pred
        return {"success": True, "prediction": pred_val}
    except Exception as e:
        return {"success": False, "message": f"Prediction error: {e}"}

def load_dataset():
    if os.path.exists(CSV_PATH):
        try:
            return pd.read_csv(CSV_PATH)
        except Exception as e:
            print(f"[model_handler] Failed to load CSV: {e}")
            return None
    return None
