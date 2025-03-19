
import { useState, useEffect } from 'react';

interface ShapePreviewProps {
  className?: string;
}

const ShapePreview = ({ className = '' }: ShapePreviewProps) => {
  const [shapes, setShapes] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const shapeTypes = [
      { type: 'rect', color: 'shape-blue' },
      { type: 'circle', color: 'shape-purple' },
      { type: 'triangle', color: 'shape-green' },
      { type: 'diamond', color: 'shape-red' },
      { type: 'star', color: 'shape-yellow' },
    ];
    
    const createRandomShape = () => {
      const { type, color } = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const left = Math.random() * 80 + 10; // 10% to 90%
      const top = Math.random() * 80 + 10; // 10% to 90%
      const size = Math.random() * 40 + 20; // 20px to 60px
      const rotation = Math.random() * 360; // 0 to 360 degrees
      
      let shapeElement;
      
      switch (type) {
        case 'rect':
          shapeElement = (
            <div
              key={`${type}-${Date.now()}-${Math.random()}`}
              className={`absolute bg-${color} rounded-md shape-shadow`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size * 0.7}px`,
                transform: `rotate(${rotation}deg)`,
              }}
            />
          );
          break;
        case 'circle':
          shapeElement = (
            <div
              key={`${type}-${Date.now()}-${Math.random()}`}
              className={`absolute bg-${color} rounded-full shape-shadow`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                transform: `rotate(${rotation}deg)`,
              }}
            />
          );
          break;
        case 'triangle':
          shapeElement = (
            <div
              key={`${type}-${Date.now()}-${Math.random()}`}
              className="absolute shape-shadow"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: 0,
                height: 0,
                borderLeft: `${size / 2}px solid transparent`,
                borderRight: `${size / 2}px solid transparent`,
                borderBottom: `${size}px solid #10B981`,
                transform: `rotate(${rotation}deg)`,
              }}
            />
          );
          break;
        case 'diamond':
          shapeElement = (
            <div
              key={`${type}-${Date.now()}-${Math.random()}`}
              className="absolute shape-shadow"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: '#EF4444',
                transform: `rotate(45deg) translate(-50%, -50%)`,
              }}
            />
          );
          break;
        case 'star':
          shapeElement = (
            <div
              key={`${type}-${Date.now()}-${Math.random()}`}
              className="absolute"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full shape-shadow">
                <polygon
                  points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                  fill="#F59E0B"
                />
              </svg>
            </div>
          );
          break;
        default:
          shapeElement = null;
      }
      
      return shapeElement;
    };
    
    // Create initial shapes
    const initialShapes: React.ReactNode[] = [];
    for (let i = 0; i < 10; i++) {
      const shape = createRandomShape();
      if (shape) initialShapes.push(shape);
    }
    setShapes(initialShapes);
    
    // Add more shapes periodically
    const interval = setInterval(() => {
      if (shapes.length > 20) {
        // Remove oldest shape
        setShapes((prevShapes) => prevShapes.slice(1));
      }
      
      const newShape = createRandomShape();
      if (newShape) {
        setShapes((prevShapes) => [...prevShapes, newShape]);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern"></div>
      
      {/* Shapes */}
      {shapes.map((shape) => shape)}
    </div>
  );
};

export default ShapePreview;
