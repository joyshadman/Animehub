import React from "react";
import pageNotFound from "../assets/404.png";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { Helmet } from "react-helmet";

const PageNotFound = () => {
  return (
    <div className="h-[100dvh] flex justify-center flex-col items-center bg-[#050505] text-center px-4">
      <Helmet>
        <title>404 | Page Not Found</title>
        <meta property="og:title" content="404 - Page Not Found" />
      </Helmet>

      {/* 🖼️ Illustration */}
      <img
        className="max-w-[320px] mb-6 w-full h-auto opacity-80"
        src={pageNotFound}
        alt="404 page not found"
      />

      {/* 📄 Error Text */}
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-black text-primary italic uppercase tracking-tighter">
          404 Error
        </h1>
        <h2 className="text-white/60 font-medium">
          Oops! It looks like this page has been deleted or moved.
        </h2>
      </div>

      {/* 🏠 Navigation Button */}
      <Link to="/home">
        <button className="bg-primary hover:bg-primary/80 transition-all duration-300 flex items-center gap-2 text-black font-bold px-6 py-3 rounded-full shadow-lg shadow-primary/10 group">
          <FaAngleLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
      </Link>
    </div>
  );
};

export default PageNotFound;