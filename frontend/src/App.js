import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const api = axios.create({
    baseURL: API_URL,
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setPrediction(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Convert form values to numbers
      const formData = {
        Pregnancies: parseFloat(form.Pregnancies),
        Glucose: parseFloat(form.Glucose),
        BloodPressure: parseFloat(form.BloodPressure),
        SkinThickness: parseFloat(form.SkinThickness),
        Insulin: parseFloat(form.Insulin),
        BMI: parseFloat(form.BMI),
        DiabetesPedigreeFunction: parseFloat(form.DiabetesPedigreeFunction),
        Age: parseFloat(form.Age),
      };
      

      const response = await api.post('/api/predict', formData);
      setPrediction(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        err.response?.data?.error || 
        err.message || 
        "An error occurred. Please try again."
      );
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      Pregnancies: "",
      Glucose: "",
      BloodPressure: "",
      SkinThickness: "",
      Insulin: "",
      BMI: "",
      DiabetesPedigreeFunction: "",
      Age: "",
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>🩺 Diabetes Prediction System</h1>
          <p className="subtitle">
            Enter patient clinical data below to generate a real-time diabetes prediction
          </p>
        </header>

        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pregnancies">
                Pregnancies <span className="required">*</span>
              </label>
              <input
                id="pregnancies"
                type="number"
                name="Pregnancies"
                placeholder="Number of pregnancies (e.g. 2)"
                value={form.Pregnancies}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="glucose">
                Glucose (mg/dL) <span className="required">*</span>
              </label>
              <input
                id="glucose"
                type="number"
                name="Glucose"
                placeholder="Plasma glucose concentration (e.g. 125)"
                value={form.Glucose}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bloodPressure">
                Blood Pressure (mm Hg) <span className="required">*</span>
              </label>
              <input
                id="bloodPressure"
                type="number"
                name="BloodPressure"
                placeholder="Diastolic blood pressure (e.g. 72)"
                value={form.BloodPressure}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="skinThickness">
                Skin Thickness (mm) <span className="required">*</span>
              </label>
              <input
                id="skinThickness"
                type="number"
                name="SkinThickness"
                placeholder="Triceps skin fold thickness (e.g. 20)"
                value={form.SkinThickness}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="insulin">
                Insulin (mu U/ml) <span className="required">*</span>
              </label>
              <input
                id="insulin"
                type="number"
                name="Insulin"
                placeholder="2-Hour serum insulin (e.g. 80)"
                value={form.Insulin}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bMI">
                BMI (kg/m²) <span className="required">*</span>
              </label>
              <input
                id="bMI"
                type="number"
                step="0.01"
                name="BMI"
                placeholder="Body mass index (e.g. 25.5)"
                value={form.BMI}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="diabetesPedigreeFunction">
                Diabetes Pedigree Function <span className="required">*</span>
              </label>
              <input
                id="diabetesPedigreeFunction"
                type="number"
                step="0.001"
                name="DiabetesPedigreeFunction"
                placeholder="Family history function (e.g. 0.45)"
                value={form.DiabetesPedigreeFunction}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">
                Age (years) <span className="required">*</span>
              </label>
              <input
                id="age"
                type="number"
                name="Age"
                placeholder="Age in years"
                value={form.Age}
                onChange={handleChange}
                min="0"
                max="120"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Predicting..." : "Predict Diabetes Risk"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset Form
            </button>
          </div>
        </form>

        {error && (
          <div className="result-card error">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {prediction && (
          <div className={`result-card ${prediction.is_diabetic ? 'diabetic' : 'non-diabetic'}`}>
            <h3>
              {prediction.is_diabetic ? "⚠️ Diabetes Detected" : "✅ No Diabetes Detected"}
            </h3>
            <div className="prediction-details">
              <div className="prediction-result">
                <span className="result-label">Prediction:</span>
                <span className={`result-value ${prediction.is_diabetic ? 'positive' : 'negative'}`}>
                  {prediction.is_diabetic ? "Positive for Diabetes" : "Negative for Diabetes"}
                </span>
              </div>
              <div className="confidence-meter">
                <div className="confidence-label">
                  <span>Probability of Diabetes: {(prediction.probability * 100).toFixed(2)}%</span>
                </div>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${prediction.probability * 100}%`,
                      backgroundColor: prediction.is_diabetic ? '#e74c3c' : '#27ae60'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
