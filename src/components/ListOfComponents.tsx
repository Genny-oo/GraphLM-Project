import React from 'react';

interface ComponentItem {
  id: number;
  name: string;
  visible: boolean;
}

interface ListOfComponentsProps {
  components: ComponentItem[];
  activeComponent: number | null;
  setActiveComponent: (id: number) => void;
}

/**
 * Component that displays a list of all other components
 * Allows selecting a component to highlight it
 */
const ListOfComponents: React.FC<ListOfComponentsProps> = ({
  components,
  activeComponent,
  setActiveComponent
}) => {
  return (
    <div className="component-list-container">
      <h2>Components</h2>
      <div className="component-buttons">
        {components.filter(comp => comp.visible).map((component) => (
          <button
            key={component.id}
            className={`component-btn ${activeComponent === component.id ? 'active' : ''}`}
            onClick={() => setActiveComponent(component.id)}
          >
            {component.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListOfComponents;
