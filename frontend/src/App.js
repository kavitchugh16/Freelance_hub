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
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* Placeholder routes for future pages */}
              <Route path="/login" element={<div className="min-h-screen bg-blue-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-blue-900 mb-4">Login Page</h1><p className="text-blue-600">Coming Soon...</p></div></div>} />
              <Route path="/signup" element={<div className="min-h-screen bg-blue-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-blue-900 mb-4">Sign Up Page</h1><p className="text-blue-600">Coming Soon...</p></div></div>} />
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