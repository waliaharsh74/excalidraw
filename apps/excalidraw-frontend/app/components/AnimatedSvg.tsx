
import { useEffect, useRef } from 'react';

interface AnimatedSvgProps {
  className?: string;
}

const AnimatedSvg = ({ className = '' }: AnimatedSvgProps) => {
  const pathRef = useRef<SVGPathElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && pathRef.current) {
          pathRef.current.classList.add('animated');
        }
      },
      { threshold: 0.5 }
    );
    
    if (pathRef.current) {
      observer.observe(pathRef.current);
    }
    
    return () => {
      if (pathRef.current) {
        observer.unobserve(pathRef.current);
      }
    };
  }, []);
  
  return (
    <svg
      viewBox="0 0 500 300"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full ${className}`}
    >
      {/* Grid Pattern */}
      <pattern
        id="grid"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="0.5"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
      
      {/* Rectangle */}
      <rect
        x="100"
        y="80"
        width="100"
        height="70"
        rx="8"
        fill="#3B82F6"
        opacity="0.8"
        className="animate-shape-move"
        style={{ animationDelay: "0.2s" }}
      />
      
      {/* Circle */}
      <circle
        cx="300"
        cy="120"
        r="40"
        fill="#8B5CF6"
        opacity="0.8"
        className="animate-float"
        style={{ animationDelay: "0.5s" }}
      />
      
      {/* Triangle */}
      <polygon
        points="200,180 230,230 170,230"
        fill="#10B981"
        opacity="0.8"
        className="animate-float"
        style={{ animationDelay: "0.8s" }}
      />
      
      {/* Star */}
      <polygon
        points="320,200 335,230 370,235 345,260 350,295 320,280 290,295 295,260 270,235 305,230"
        fill="#F59E0B"
        opacity="0.8"
        className="animate-shape-move"
        style={{ animationDelay: "1.2s" }}
      />
      
      {/* Connecting Line */}
      <path
        ref={pathRef}
        d="M 150,150 C 180,220 250,100 300,150 S 350,200 370,220"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
        className="svg-path"
      />
      
      {/* Cursor */}
      <circle
        cx="370"
        cy="220"
        r="6"
        fill="#EF4444"
        className="animate-pulse-subtle"
      />
    </svg>
  );
};

export default AnimatedSvg;
