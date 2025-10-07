// src/pages/Home.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  { title: "Logo Design", image: "" },
  { title: "Website Development", image: "" },
  { title: "Mobile App Design", image: "" },
  { title: "Social Media Marketing", image: "" },
  { title: "Video Editing", image: "" },
  { title: "Content Writing", image: "" },
];

const Home: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim()) navigate(`/browse-projects?search=${search.trim()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative bg-gray-900 text-white">
        {/* The div with the background image URL has been removed */}
        <div className="relative z-10 container mx-auto px-6 py-32 md:py-40 max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Find the perfect <span className="text-green-400">freelance services</span> for your business
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <input
              type="text"
              className="w-full px-4 py-3 rounded-md text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder='Try "Full Stack Developer"'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              Search <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-200">
            <span className="font-semibold">Popular:</span>
            {["Logo Design", "WordPress", "AI Services", "SEO", "Video Editing"].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 bg-gray-800/50 rounded-full hover:bg-green-500 hover:text-white transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-gray-900 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <div key={cat.title} className="group cursor-pointer">
                {/* The img tag and its container div have been removed */}
                <p className="text-center mt-3 font-medium">{cat.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED BY section has been removed */}

      {/* CTA */}
      <section className="bg-green-500 text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Join the future of freelance work</h2>
        <p className="text-lg mb-6">Get your projects done faster, smarter, and hassle-free.</p>
        <button
          onClick={() => navigate("/register")}
          className="px-8 py-3 bg-white text-green-600 font-semibold rounded-md hover:bg-gray-100 transition"
        >
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Home;