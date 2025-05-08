import React from 'react';

interface Component5Props {
  isActive: boolean;
  setActive: () => void;
  onRemove: () => void;
}

/**
 * Component 5: Removable Component
 * Has a delete button to remove itself from the UI
 */
const Component5: React.FC<Component5Props> = ({ isActive, setActive, onRemove }) => {
  return (
    <div 
      className={`component-card ${isActive ? 'active' : ''}`}
      onClick={setActive}
    >
      <div className="component-header">
        <h2>Removable Component</h2>
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          Delete
        </button>
      </div>
      <p className="component-description">
        This component can be removed from the UI by clicking the delete button.
        Once removed, it will no longer appear in the component list.
      </p>
    </div>
  );
};

export default Component5;