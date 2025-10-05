import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import FreelancerDetails from "./components/FreelancerDetails";
import FreelancerDashboard from "./components/FreelancerDashboard";
import LandingPage from "./components/LandingPage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  useEffect(() => {
    const helloWorldApi = async () => {
      try {
        const response = await axios.get(`${API}/`);
        console.log(response.data.message);
      } catch (e) {
        console.error(e, `errored out requesting / api`);
      }
    };
    helloWorldApi();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/freelancer-details" element={<FreelancerDetails />} />
          <Route path="/dashboard" element={<FreelancerDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;