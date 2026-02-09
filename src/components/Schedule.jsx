import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaCalendarDay } from "react-icons/fa6";

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDays = () => [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i - 1);
    return {
      full: d.toISOString().split('T')[0],
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      num: d.getDate()
    };
  });

  const days = getDays();
  const [activeDate, setActiveDate] = useState(days[1].full);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const tzOffset = new Date().getTimezoneOffset(); 
        const { data } = await axios.get(`https://api-anime-v2.vercel.app/api/v1/anime/schedule`, {
          params: { date: activeDate, tzOffset: tzOffset }
        });
        const list = data?.data?.scheduledAnimes || data?.scheduledAnimes || [];
        setScheduleData(list);
      } catch (err) {
        console.error("Schedule Error", err);
        setScheduleData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [activeDate]);

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-[1.5rem] overflow-hidden backdrop-blur-3xl h-full flex flex-col">
      {/* 📅 MINI HEADER */}
      <div className="p-4 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-2 text-primary mb-3">
          <FaCalendarDay size={12} />
          <span className="font-black italic uppercase tracking-[0.1em] text-[9px]">Schedule</span>
        </div>
        
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {days.map((d) => (
            <button
              key={d.full}
              onClick={() => setActiveDate(d.full)}
              className={`flex flex-col items-center min-w-[42px] py-1.5 rounded-xl transition-all ${
                activeDate === d.full 
                ? "bg-primary text-black font-bold scale-105" 
                : "bg-white/5 text-white/30 hover:bg-white/10"
              }`}
            >
              <span className="text-[7px] uppercase">{d.name}</span>
              <span className="text-xs">{d.num}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 📺 TIGHT LIST */}
      <div className="flex-grow p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex justify-center py-10"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-0.5">
            {scheduleData.length > 0 ? (
              scheduleData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[9px] font-bold text-white/20 group-hover:text-primary">{item.time}</span>
                    <span className="text-[12px] font-semibold text-white/70 truncate group-hover:text-white">{item.name}</span>
                  </div>
                  <div className="bg-white/5 px-2 py-0.5 rounded text-[9px] font-black text-white/40">
                    EP {item.jname?.split(' ').pop() || '??'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-white/10 text-[10px] uppercase font-bold italic">No Data</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;