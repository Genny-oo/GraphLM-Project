import React from 'react';

interface Component2Props {
  isActive: boolean;
  setActive: () => void;
}

/**
 * Component 2: Background Image with Link
 * Displays an image that links to its source when clicked
 */
const Component2: React.FC<Component2Props> = ({ isActive, setActive }) => {
  // Using a placeholder image - replace with your preferred image URL
  const imageUrl = "https://via.placeholder.com/400x300";
  const sourceUrl = "https://placeholder.com";
  
  return (
    <div 
      className={`component-card ${isActive ? 'active' : ''}`}
      onClick={setActive}
    >
      <h2>Background Image</h2>
      <a 
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="image-container">
          <img src={imageUrl} alt="Background" />
        </div>
      </a>
      <p className="image-caption">Click on the image to visit source</p>
    </div>
  );
};

export default Component2;

