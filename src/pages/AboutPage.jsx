import React from "react";
import { Helmet } from "react-helmet";
import { FaGithub, FaLinkedin, FaGlobe, FaCode, FaServer, FaBolt, FaLayerGroup, FaShieldHalved, FaRocket } from "react-icons/fa6";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] pt-28 text-white">
      <Helmet>
        <title>About | AniStorm - Next Gen Anime Indexing</title>
      </Helmet>

      {/* ⚡ Background Amber Storm Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#ffb700]/10 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-[#ffb700]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* 🌪️ Project Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-[#ffb700] text-black text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full italic shadow-lg shadow-[#ffb700]/40">
              The Evolution
            </span>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-[#ffb700]/20 to-transparent"></div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-10 bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
            AniStorm
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className="text-xl md:text-2xl text-[#ffb700] font-bold leading-tight italic">
                Redefining the anime streaming experience through elite indexing and lightning-fast edge computing.
              </p>
              <p className="text-lg text-white/50 leading-relaxed font-medium">
                AniStorm isn't just another directory; it is a sophisticated gateway to the world of Japanese animation. By leveraging the advanced architecture of the <span className="text-white">HiAnime API</span> and specialized mirrors, we provide real-time access to a library of over 10,000+ titles. 
              </p>
              <p className="text-lg text-white/50 leading-relaxed font-medium">
                Our platform eliminates the friction of traditional streaming by aggregating high-bitrate sources, multiple sub/dub variants, and comprehensive metadata. Whether you're chasing the latest seasonal simulcasts or diving into obscure retro OVAs, AniStorm delivers with surgical precision.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: <FaRocket />, label: "Ultra Fast", val: "0.2s Load" },
                 { icon: <FaLayerGroup />, label: "Library", val: "10k+ Shows" },
                 { icon: <FaServer />, label: "Backends", val: "HiAnime v2" },
                 { icon: <FaShieldHalved />, label: "Security", val: "Ad-Free UI" }
               ].map((stat, i) => (
                 <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md group hover:border-[#ffb700]/30 transition-all">
                   <div className="text-[#ffb700] mb-3 text-xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                   <div className="text-2xl font-black uppercase italic tracking-tighter">{stat.val}</div>
                   <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{stat.label}</div>
                 </div>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: <FaCode className="text-[#ffb700]" />, title: "The Stack", desc: "Built with React 18 and Vite for near-instantaneous state transitions and a butter-smooth user interface." },
              { icon: <FaServer className="text-[#ffb700]" />, title: "The Engine", desc: "Deep integration with the Consumet/HiAnime ecosystem ensures accurate scheduling and high-quality streaming links." },
              { icon: <FaBolt className="text-[#ffb700]" />, title: "The Visuals", desc: "Crafted with Tailwind CSS, utilizing glassmorphism and GPU-accelerated animations for a premium dark-mode aesthetic." }
            ].map((tech, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl hover:bg-white/[0.05] hover:border-[#ffb700]/20 transition-all duration-500">
                <div className="text-3xl mb-6">{tech.icon}</div>
                <h3 className="font-black uppercase text-sm tracking-widest mb-4">{tech.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 👤 About Me Section */}
        <section className="relative group p-8 md:p-16 bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl mb-32">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2500ms] ease-in-out bg-gradient-to-r from-transparent via-[#ffb700]/5 to-transparent pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[#ffb700] blur-3xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
              <div className="w-48 h-48 relative rounded-full border-2 border-white/10 p-2 overflow-hidden shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:border-[#ffb700]/50">
                <img 
                  src="https://github.com/joyshadman.png" 
                  alt="Joy Shadman" 
                  className="w-full h-full object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            <div className="flex-grow text-center md:text-left">
              <h2 className="text-4xl font-black italic uppercase tracking-wider mb-2 text-white">Joy Shadman</h2>
              <p className="text-[#ffb700] font-bold uppercase text-xs tracking-[0.4em] mb-8 underline decoration-2 underline-offset-8 decoration-[#ffb700]/30">Full Stack Developer</p>
              
              <p className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl font-medium">
                As a developer who practically lives in the terminal and breathes anime, I built AniStorm to solve a problem: the lack of clean, data-rich interfaces in the streaming world. My focus is on writing clean, scalable code and designing layouts that feel like the premium software of the future.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {[
                  { icon: <FaGithub />, label: "GitHub", url: "https://github.com/joyshadman" },
                  { icon: <FaLinkedin />, label: "LinkedIn", url: "https://www.linkedin.com/in/joy-shadman-30067526a/" },
                  { icon: <FaGlobe />, label: "Portfolio", url: "https://cutt.ly/dtaoXuoM" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-[#ffb700] hover:border-[#ffb700] hover:text-black transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em]"
                  >
                    {social.icon} {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;