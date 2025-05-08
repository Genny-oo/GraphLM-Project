import React, { useState } from 'react';

interface Component1Props {
  isActive: boolean;
  setActive: () => void;
}

/**
 * Component 1: Project Info with Counter
 * Displays project name, author, and has a counter that can be incremented/decremented
 */
const Component1: React.FC<Component1Props> = ({ isActive, setActive }) => {
  const [count, setCount] = useState(0);
  
  return (
    <div 
      className={`component-card ${isActive ? 'active' : ''}`}
      onClick={setActive}
    >
      <h2>Project Info</h2>
      <div className="project-info">
        <p><strong>Project Name:</strong> React Component Showcase</p>
        <p><strong>Created by:</strong> Your Name</p>
      </div>
      <div className="counter-controls">
        <button 
          className="decrement"
          onClick={(e) => {
            e.stopPropagation();
            setCount(count - 1);
          }}
        >
          -
        </button>
        <span className="counter-display">{count}</span>
        <button 
          className="increment"
          onClick={(e) => {
            e.stopPropagation();
            setCount(count + 1);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Component1;