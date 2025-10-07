// src/pages/Home.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Logo Design",
    image:
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Website Development",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Mobile App Design",
    image:
      "https://img.freepik.com/free-vector/app-development-banner_33099-1720.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Social Media Marketing",
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Video Editing",
    image:
      "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Content Writing",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1900&q=80')] bg-cover bg-center opacity-60"></div>
        <div className="relative z-10 container mx-auto px-6 py-32 md:py-40 max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Find the perfect{" "}
            <span className="text-green-400">freelance services</span> for your
            business
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
            {["Logo Design", "WordPress", "AI Services", "SEO", "Video Editing"].map(
              (tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 bg-gray-800/50 rounded-full hover:bg-green-500 hover:text-white transition"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-gray-900 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <div key={cat.title} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg shadow hover:shadow-lg transition">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-center mt-3 font-medium">{cat.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
            {/* TRUSTED BY */}
      <section className="py-10 bg-white border-t">
        <div className="container mx-auto px-6 text-center">
          <p className="uppercase text-gray-500 font-semibold mb-6 text-sm tracking-wider">
            Trusted by leading brands
          </p>
          <div className="flex justify-center flex-wrap gap-10 grayscale opacity-90 hover:opacity-100 transition">
            {[
              {
                name: "Google",
                logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
              },
              {
                name: "Meta",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1280px-Meta_Platforms_Inc._logo.svg.png",
              },
              {
                name: "Netflix",
                logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
              },
              {
                name: "PayPal",
                logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
              },
              {
                name: "Microsoft",
                logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
              },
              {
                name: "Amazon",
                logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
              },
            ].map((brand) => (
              <div key={brand.name} className="flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 md:h-10 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="bg-green-500 text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Join the future of freelance work
        </h2>
        <p className="text-lg mb-6">
          Get your projects done faster, smarter, and hassle-free.
        </p>
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