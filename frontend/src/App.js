import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Privacy from "./components/Privacy";
import Signup from "./components/Signup";
import Login from "./components/Login";
import FreelancerDetails from "./components/FreelancerDetails";
import ClientDetails from "./components/ClientDetails";
import FreelancerDashboard from "./components/FreelancerDashboard";

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

    // Set authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    helloWorldApi();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/freelancer-details" element={<FreelancerDetails />} />
              <Route path="/client-details" element={<ClientDetails />} />
              <Route path="/dashboard" element={<FreelancerDashboard />} />
              <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
              
              {/* Placeholder routes for future pages */}
              <Route path="/client-dashboard" element={<div className="min-h-screen bg-blue-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-blue-900 mb-4">Client Dashboard</h1><p className="text-blue-600">Coming Soon...</p></div></div>} />
              <Route path="/find-work" element={<div className="min-h-screen bg-blue-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-blue-900 mb-4">Find Work</h1><p className="text-blue-600">Coming Soon...</p></div></div>} />
              <Route path="/hire-talent" element={<div className="min-h-screen bg-blue-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-blue-900 mb-4">Hire Talent</h1><p className="text-blue-600">Coming Soon...</p></div></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;