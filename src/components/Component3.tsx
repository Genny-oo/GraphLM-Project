import React, { useState } from 'react';

interface Component3Props {
  isActive: boolean;
  setActive: () => void;
}

/**
 * Component 3: Multi-Section Component
 * Shows different sections with Next/Prev navigation
 */
const Component3: React.FC<Component3Props> = ({ isActive, setActive }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = [
    { title: "Section One", content: "This is the content for section one." },
    { title: "Section Two", content: "Here's some information for section two." },
    { title: "Section Three", content: "The final section with different content." }
  ];
  
  const nextSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSection((currentSection + 1) % sections.length);
  };
  
  const prevSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSection((currentSection - 1 + sections.length) % sections.length);
  };
  
  return (
    <div 
      className={`component-card ${isActive ? 'active' : ''}`}
      onClick={setActive}
    >
      <h2>Multi-Section Component</h2>
      <div className="section-content">
        <h3>{sections[currentSection].title}</h3>
        <p>{sections[currentSection].content}</p>
      </div>
      <div className="section-navigation">
        <button onClick={prevSection}>
          Prev
        </button>
        <span>{currentSection + 1} / {sections.length}</span>
        <button className="next" onClick={nextSection}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Component3;