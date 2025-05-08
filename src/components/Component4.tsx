import React, { useState } from 'react';

interface Component4Props {
  isActive: boolean;
  setActive: () => void;
}

/**
 * Component 4: Editable Title
 * The title can be edited using a text input
 */
const Component4: React.FC<Component4Props> = ({ isActive, setActive }) => {
  const [title, setTitle] = useState("Editable Title Component");
  
  return (
    <div 
      className={`component-card ${isActive ? 'active' : ''}`}
      onClick={setActive}
    >
      <h2>{title}</h2>
      <div className="title-edit">
        <label htmlFor="title-input">
          Edit Title:
        </label>
        <input
          id="title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default Component4;
