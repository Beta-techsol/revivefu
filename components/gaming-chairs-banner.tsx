"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export function GamingChairsBanner() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 lg:py-16 bg-gray-100 relative overflow-hidden w-full">
      {/* Add Poppins and Dancing Script fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        .dancing-font {
          font-family: 'Dancing Script', cursive;
        }
        .poppins-font {
          font-family: 'Poppins', sans-serif;
        }

        /* Light opacity rotating vectors */
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes float-rotate {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.03;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.08;
          }
        }
        
        @keyframes pulse-rotate {
          0%, 100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 0.02; 
          }
          50% { 
            transform: scale(1.1) rotate(90deg); 
            opacity: 0.06; 
          }
        }

        /* Bouncing Balls Animations - Only for chairs */
        @keyframes bounce-left {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.6;
          }
          25% { 
            transform: translateY(-40px) translateX(20px); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-80px) translateX(40px); 
            opacity: 1;
          }
          75% { 
            transform: translateY(-40px) translateX(60px); 
            opacity: 0.8;
          }
        }

        @keyframes bounce-right {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.5;
          }
          33% { 
            transform: translateY(-60px) translateX(-30px); 
            opacity: 0.9;
          }
          66% { 
            transform: translateY(-30px) translateX(-60px); 
            opacity: 0.7;
          }
        }

        /* 50% OFF Background Animation */
        @keyframes discount-float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.35;
          }
          50% { 
            transform: translateY(-20px) rotate(2deg); 
            opacity: 0.25;
          }
        }

        /* Shining Effect Animation - Only once when in view */
        @keyframes shine-effect {
          0% {
            background-position: -200% 0;
            opacity: 0.35;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            background-position: 200% 0;
            opacity: 1;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            background-position: 200% 0;
            opacity: 0.35;
          }
        }

        .animate-rotate-slow { 
          animation: rotate-slow 25s linear infinite; 
        }
        
        .animate-rotate-reverse { 
          animation: rotate-reverse 20s linear infinite; 
        }
        
        .animate-float-rotate { 
          animation: float-rotate 15s ease-in-out infinite; 
        }
        
        .animate-pulse-rotate { 
          animation: pulse-rotate 12s ease-in-out infinite; 
        }

        .animate-bounce-left { 
          animation: bounce-left 4s ease-in-out infinite; 
        }
        
        .animate-bounce-right { 
          animation: bounce-right 5s ease-in-out infinite; 
        }

        .animate-discount-float { 
          animation: discount-float 8s ease-in-out infinite; 
        }

        .animate-shine-once {
          animation: shine-effect 3s ease-in-out 1s 1 forwards;
        }

        /* Shining gradient background */
        .shine-text {
          background: linear-gradient(
            90deg,
            #C53D39 0%,
            #F1BA69 25%,
            #ffffff 50%,
            #F1BA69 75%,
            #C53D39 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* 50% OFF Large Background Text - Responsive */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ padding: "20px" }}
      >
        <div className="animate-discount-float w-full flex items-center justify-center">
          <span
            className={`dancing-font text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[16rem] xl:text-[20rem] font-bold select-none whitespace-nowrap shine-text ${
              isInView ? "animate-shine-once" : ""
            }`}
            style={{
              opacity: 0.35,
              lineHeight: 0.8,
              letterSpacing: "-0.02em",
              width: "100%",
              textAlign: "center",
            }}
          >
            50% OFF
          </span>
        </div>
      </div>

      {/* Light Opacity Rotating Vectors - Responsive */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Behind Left Chair - Responsive */}
        <div className="absolute left-4 sm:left-8 lg:left-16 top-1/4 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 border-2 border-[#C53D39]/5 rounded-lg animate-rotate-slow"></div>
        <div className="absolute left-6 sm:left-12 lg:left-24 top-1/2 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 bg-gradient-to-r from-[#F1BA69]/3 to-[#C53D39]/3 rounded-full animate-float-rotate"></div>
        <div className="absolute left-2 sm:left-4 lg:left-8 bottom-1/4 w-14 sm:w-21 lg:w-28 h-14 sm:h-21 lg:h-28 border border-dashed border-[#C53D39]/4 rounded-full animate-pulse-rotate"></div>
        <div className="absolute left-8 sm:left-16 lg:left-32 bottom-1/3 w-10 sm:w-15 lg:w-20 h-10 sm:h-15 lg:h-20 bg-[#F1BA69]/2 transform rotate-45 animate-rotate-reverse"></div>

        {/* Behind Right Chair - Responsive */}
        <div className="absolute right-4 sm:right-8 lg:right-16 top-1/4 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 border-2 border-[#F1BA69]/5 rounded-lg animate-rotate-reverse"></div>
        <div className="absolute right-6 sm:right-12 lg:right-24 top-1/2 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 bg-gradient-to-r from-[#C53D39]/3 to-[#F1BA69]/3 rounded-full animate-float-rotate"></div>
        <div className="absolute right-2 sm:right-4 lg:right-8 bottom-1/4 w-14 sm:w-21 lg:w-28 h-14 sm:h-21 lg:h-28 border border-dashed border-[#F1BA69]/4 rounded-full animate-pulse-rotate"></div>
        <div className="absolute right-8 sm:right-16 lg:right-32 bottom-1/3 w-10 sm:w-15 lg:w-20 h-10 sm:h-15 lg:h-20 bg-[#C53D39]/2 transform rotate-45 animate-rotate-slow"></div>

        {/* Center Banner Vectors - Responsive */}
        <div className="absolute top-4 sm:top-6 lg:top-8 left-1/2 transform -translate-x-1/2 w-20 sm:w-30 lg:w-40 h-20 sm:h-30 lg:h-40 border border-[#C53D39]/3 rounded-lg rotate-12 animate-rotate-slow"></div>
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 w-18 sm:w-27 lg:w-36 h-18 sm:h-27 lg:h-36 bg-gradient-to-r from-[#F1BA69]/2 to-[#C53D39]/2 rounded-full animate-pulse-rotate"></div>
        <div className="absolute top-1/3 left-1/4 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-[#F1BA69]/4 rotate-45 animate-float-rotate"></div>
        <div className="absolute top-1/3 right-1/4 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-[#C53D39]/4 rotate-45 animate-float-rotate"></div>
        <div className="absolute bottom-1/3 left-1/3 w-6 sm:w-9 lg:w-12 h-6 sm:h-9 lg:h-12 bg-[#C53D39]/3 rounded-full animate-rotate-reverse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-6 sm:w-9 lg:w-12 h-6 sm:h-9 lg:h-12 bg-[#F1BA69]/3 rounded-full animate-rotate-slow"></div>

        {/* Additional floating elements - Responsive */}
        <div className="absolute top-8 sm:top-12 lg:top-16 left-1/3 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 border border-[#C53D39]/5 rounded-lg animate-pulse-rotate"></div>
        <div className="absolute top-8 sm:top-12 lg:top-16 right-1/3 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 border border-[#F1BA69]/5 rounded-lg animate-pulse-rotate"></div>
        <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-1/4 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-[#F1BA69]/4 rounded-full animate-float-rotate"></div>
        <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 right-1/4 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-[#C53D39]/4 rounded-full animate-float-rotate"></div>

        {/* Bouncing Balls - Only 2 balls behind each chair - Responsive */}
        {/* Left Chair Balls */}
        <div className="absolute top-1/3 left-5 sm:left-10 lg:left-20 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 bg-gradient-to-br from-[#C53D39] to-[#F1BA69] rounded-full animate-bounce-left shadow-lg"></div>
        <div
          className="absolute bottom-1/3 left-7 sm:left-14 lg:left-28 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-gradient-to-br from-[#F1BA69] to-[#C53D39] rounded-full animate-bounce-left shadow-md"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Right Chair Balls */}
        <div className="absolute top-1/3 right-5 sm:right-10 lg:right-20 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 bg-gradient-to-br from-[#F1BA69] to-[#C53D39] rounded-full animate-bounce-right shadow-lg"></div>
        <div
          className="absolute bottom-1/3 right-7 sm:right-14 lg:right-28 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-gradient-to-br from-[#C53D39] to-[#F1BA69] rounded-full animate-bounce-right shadow-md"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* SVG Vectors with ultra light opacity - Responsive */}
        <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 1200 400">
          <g className="animate-rotate-slow origin-center">
            <polygon points="200,100 220,80 240,100 220,120" fill="url(#gamingGradient1)" opacity="0.3" />
            <circle cx="300" cy="150" r="15" stroke="url(#gamingGradient2)" strokeWidth="2" fill="none" opacity="0.4" />
          </g>
          <g className="animate-rotate-reverse origin-center">
            <rect
              x="900"
              y="200"
              width="30"
              height="30"
              rx="5"
              fill="url(#gamingGradient1)"
              opacity="0.2"
              transform="rotate(45 915 215)"
            />
            <polygon
              points="1000,300 1020,280 1040,300 1020,320"
              stroke="url(#gamingGradient2)"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
          </g>
          <g className="animate-float-rotate">
            <circle
              cx="150"
              cy="300"
              r="20"
              stroke="url(#gamingGradient1)"
              strokeWidth="1"
              fill="none"
              opacity="0.25"
            />
            <rect x="1050" y="300" width="25" height="25" rx="3" fill="url(#gamingGradient2)" opacity="0.2" />
          </g>

          <defs>
            <linearGradient id="gamingGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C53D39" />
              <stop offset="100%" stopColor="#F1BA69" />
            </linearGradient>
            <linearGradient id="gamingGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F1BA69" />
              <stop offset="100%" stopColor="#C53D39" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Full width container without max-width constraints - Responsive */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
        {/* Responsive layout: vertical on mobile, horizontal on desktop */}
        <div
          className={`flex flex-col lg:flex-row items-center justify-between w-full space-y-8 lg:space-y-0 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Left Gaming Chair - Responsive sizing */}
          <div
            className={`flex-shrink-0 transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] xl:w-[400px] xl:h-[400px]">
              <Image
                src="/gaming-chair-1.png"
                alt="Gaming Chair Red Dragon"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Center Content - Responsive */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            {/* Stylish Header - Responsive font sizes */}
            <div
              className={`transition-all duration-1000 delay-500 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="dancing-font text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">
                Great Range of
              </span>
            </div>

            {/* Main Heading - Responsive font sizes */}
            <div
              className={`transition-all duration-1000 delay-700 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="poppins-font text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-gray-900 leading-tight mt-2 whitespace-nowrap">
                Gaming Chairs
              </h2>
            </div>

            {/* Description - Responsive */}
            <div
              className={`transition-all duration-1000 delay-900 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="relative mt-4 sm:mt-6">
                <div className="absolute -left-3 sm:-left-4 top-0 w-1 h-full bg-gradient-to-b from-[#C53D39] to-[#F1BA69] rounded-full"></div>
                <p className="poppins-font text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-xs sm:max-w-sm md:max-w-md pl-4 sm:pl-6 font-normal">
                  Professional gaming chairs with <span className="text-[#C53D39] font-bold">ergonomic design</span> for
                  ultimate comfort during long gaming sessions
                </p>
              </div>
            </div>

            {/* Shop Now Button - Responsive */}
            <div
              className={`pt-6 sm:pt-8 transition-all duration-1000 delay-1100 ${
                isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              }`}
            >
              <Link href="/category/gaming-chairs">
                <button
                  className="group relative bg-white text-gray-900 font-normal text-sm sm:text-base lg:text-lg border border-[#C53D39] hover:text-white hover:border-transparent transition-all duration-700 overflow-hidden poppins-font"
                  style={{
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    borderRadius: "7px",
                    borderWidth: "1px",
                  }}
                >
                  {/* Left-Right Fill Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>

                  {/* Left Fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>

                  {/* Right Fill */}
                  <div className="absolute inset-0 bg-gradient-to-l from-[#F1BA69] to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out delay-100"></div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full delay-300"></div>

                  {/* Button Content */}
                  <span className="relative z-10 flex items-center justify-center space-x-2 transition-all duration-500">
                    <span className="transition-colors duration-300">Shop Now</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Gaming Chair - Responsive sizing with horizontal flip */}
          <div
            className={`flex-shrink-0 transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] xl:w-[400px] xl:h-[400px] transform scale-x-[-1]">
              <Image
                src="/gaming-chair-2.png"
                alt="Gaming Chair Superman"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
