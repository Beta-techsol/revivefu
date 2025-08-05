"use client"

import { useState } from "react"
import { Star, Trophy, Target, Zap, Crown, Rocket } from "lucide-react"

const timelineData = [
  {
    year: "2004",
    month: "January",
    title: "Company Founded",
    description: "Gets launched as merchant by Naveed Iqbal in Lahore Pakistan.",
    active: false,
  },
  {
    year: "2006",
    month: "May",
    title: "Import Registration",
    description: "Registered our importing company.",
    active: false,
  },
  {
    year: "2008",
    month: "December",
    title: "Manufacturing Expansion",
    description: "Started our own Manufacturing company in Lahore and customizing both home & office products.",
    active: true,
  },
  {
    year: "2015",
    month: "February",
    title: "Online Store Launch",
    description: "Launched Our Online store",
    active: false,
  },
  {
    year: "2017",
    month: "September",
    title: "Marketplace Launch",
    description: "Gets launched as online marketplace merchant",
    active: false,
  },
  {
    year: "2018",
    month: "July",
    title: "Industry Leader",
    description: "Turn out to be one of the best online furniture",
    active: false,
  },
]

export default function TimelineSection() {
  const [activeYear, setActiveYear] = useState("2008")

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Enhanced Animated Background Vectors */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Existing vectors */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-orange-200 rounded-full opacity-30 animate-spin-slow"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-red-200 rotate-45 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-25 animate-bounce-slow"></div>
        <div className="absolute top-1/2 right-10 w-8 h-8 border-2 border-orange-300 transform rotate-45 opacity-30 animate-spin-reverse"></div>
        <div className="absolute bottom-32 right-1/3 w-14 h-14 border-2 border-red-300 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-20 left-1/3 w-6 h-6 bg-orange-200 transform rotate-45 opacity-25 animate-float"></div>

        {/* New success vectors */}
        <div className="absolute top-16 right-1/4 opacity-25">
          <Star className="w-10 h-10 text-yellow-400 animate-twinkle" />
        </div>
        <div className="absolute bottom-16 left-16 opacity-20">
          <Trophy className="w-12 h-12 text-orange-400 animate-trophy-bounce" />
        </div>
        <div className="absolute top-1/3 left-1/2 opacity-30">
          <Target className="w-8 h-8 text-red-400 animate-target-pulse" />
        </div>
        <div className="absolute bottom-1/3 right-16 opacity-25">
          <Zap className="w-14 h-14 text-yellow-500 animate-zap-flash" />
        </div>
        <div className="absolute top-24 right-1/3 opacity-20">
          <Crown className="w-10 h-10 text-orange-500 animate-crown-glow" />
        </div>
        <div className="absolute bottom-24 left-1/2 opacity-30">
          <Rocket className="w-12 h-12 text-red-500 animate-rocket-launch" />
        </div>

        {/* Additional geometric success shapes */}
        <div className="absolute top-40 left-20 w-10 h-10 bg-gradient-to-r from-yellow-200 to-orange-200 transform rotate-12 opacity-25 animate-success-float"></div>
        <div className="absolute bottom-40 right-24 w-8 h-8 border-2 border-yellow-300 rounded-full opacity-30 animate-success-spin"></div>
        <div className="absolute top-2/3 left-10 w-6 h-6 bg-gradient-to-r from-orange-300 to-red-300 opacity-25 animate-diamond-rotate"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-2 bg-gradient-to-r from-yellow-200 to-orange-200 opacity-20 animate-line-expand"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-['Montserrat'] text-gray-900 mb-4">
            Discover Revive Furniture's Journey
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto"></div>
        </div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transform -translate-y-1/2 transition-all duration-500"
            style={{
              width: `${((timelineData.findIndex((item) => item.year === activeYear) + 1) / timelineData.length) * 100}%`,
            }}
          ></div>

          {/* Timeline Points */}
          <div className="relative flex justify-between items-center">
            {timelineData.map((item, index) => (
              <div key={item.year} className="flex flex-col items-center relative">
                <button
                  onClick={() => setActiveYear(item.year)}
                  className={`w-6 h-6 rounded-full border-4 transition-all duration-300 hover:scale-110 relative z-10 ${
                    activeYear === item.year
                      ? "bg-[#C53D39] border-[#C53D39] shadow-lg"
                      : "bg-white border-gray-300 hover:border-[#C53D39]"
                  }`}
                />
                {/* Animated Ring for Active Year */}
                {activeYear === item.year && (
                  <div className="absolute w-12 h-12 border-2 border-[#C53D39] rounded-full opacity-50 animate-ping"></div>
                )}
                <div className="mt-4 text-center">
                  <div
                    className={`text-lg font-bold transition-colors duration-300 ${
                      activeYear === item.year ? "text-[#C53D39]" : "text-gray-600"
                    }`}
                  >
                    {item.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="mt-12 max-w-3xl mx-auto">
          {timelineData.map((item) => (
            <div
              key={item.year}
              className={`transition-all duration-500 ${
                activeYear === item.year
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4 absolute"
              }`}
            >
              {activeYear === item.year && (
                <div className="bg-white rounded-lg shadow-lg p-8 relative overflow-hidden">
                  {/* Background Decorative Elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 border border-orange-100 rounded-full opacity-50 animate-spin-slow"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-r from-orange-100 to-red-100 transform rotate-45 opacity-30 animate-pulse"></div>

                  <div className="flex items-start gap-6">
                    {/* Founder Image for every milestone */}
                    <div className="flex-shrink-0">
                      <img
                        src="/about/founder.webp"
                        alt="Naveed Iqbal - Founder"
                        className="w-20 h-20 rounded-full object-cover border-4 border-gradient-to-r from-[#C53D39] to-[#F1BA69] shadow-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{item.year.slice(-2)}</span>
                        </div>
                        <div>
                          <div className="text-sm text-[#C53D39] font-semibold">
                            {item.month} {item.year}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-8px) rotate(45deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        @keyframes trophy-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(-5deg); }
          75% { transform: translateY(-3px) rotate(5deg); }
        }
        
        @keyframes target-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes zap-flash {
          0%, 90%, 100% { opacity: 0.25; }
          5%, 10% { opacity: 0.8; }
        }
        
        @keyframes crown-glow {
          0%, 100% { opacity: 0.2; filter: brightness(1); }
          50% { opacity: 0.6; filter: brightness(1.5); }
        }
        
        @keyframes rocket-launch {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-10deg); }
          75% { transform: translateY(-5px) rotate(10deg); }
        }
        
        @keyframes success-float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-12px) rotate(12deg); }
        }
        
        @keyframes success-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes diamond-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes line-expand {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.5); }
        }
        
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 6s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-float { animation: float 2.5s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-trophy-bounce { animation: trophy-bounce 3s ease-in-out infinite; }
        .animate-target-pulse { animation: target-pulse 2.5s ease-in-out infinite; }
        .animate-zap-flash { animation: zap-flash 3s ease-in-out infinite; }
        .animate-crown-glow { animation: crown-glow 4s ease-in-out infinite; }
        .animate-rocket-launch { animation: rocket-launch 2.8s ease-in-out infinite; }
        .animate-success-float { animation: success-float 3.5s ease-in-out infinite; }
        .animate-success-spin { animation: success-spin 5s ease-in-out infinite; }
        .animate-diamond-rotate { animation: diamond-rotate 4s linear infinite; }
        .animate-line-expand { animation: line-expand 3s ease-in-out infinite; }
      `}</style>
    </section>
  )
}
