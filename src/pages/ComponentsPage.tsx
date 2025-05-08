import React, { useState } from 'react';
import Component1 from '../components/Component1';
import Component2 from '../components/Component2';
import Component3 from '../components/Component3';
import Component4 from '../components/Component4';
import Component5 from '../components/Component5';
import ListOfComponents from '../components/ListOfComponents';

/**
 * Page that displays and manages all the components
 */
const ComponentsPage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<number | null>(null);
  const [components, setComponents] = useState([
    { id: 1, name: 'Project Info', visible: true },
    { id: 2, name: 'Background Image', visible: true },
    { id: 3, name: 'Multi-Section', visible: true },
    { id: 4, name: 'Editable Title', visible: true },
    { id: 5, name: 'Removable Component', visible: true },
  ]);

  /**
   * Handles removing a component from the UI
   */
  const handleRemoveComponent = (id: number) => {
    setComponents(components.map((comp) => 
      comp.id === id ? { ...comp, visible: false } : comp
    ));
  };

  return (
    <div className="components-page">
      <h1>Component Gallery</h1>
      
      <div className="components-container">
        {/* Sidebar with list of components */}
        <div className="components-sidebar">
          <ListOfComponents 
            components={components}
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
        </div>
        
        {/* Main content area with components */}
        <div className="components-display">
          <div className="components-grid">
            {/* Component 1: Project Info */}
            {components.find(c => c.id === 1)?.visible && (
              <Component1 
                isActive={activeComponent === 1} 
                setActive={() => setActiveComponent(1)}
              />
            )}
            
            {/* Component 2: Background Image */}
            {components.find(c => c.id === 2)?.visible && (
              <Component2 
                isActive={activeComponent === 2} 
                setActive={() => setActiveComponent(2)}
              />
            )}
            
            {/* Component 3: Multi-Section */}
            {components.find(c => c.id === 3)?.visible && (
              <Component3 
                isActive={activeComponent === 3} 
                setActive={() => setActiveComponent(3)}
              />
            )}
            
            {/* Component 4: Editable Title */}
            {components.find(c => c.id === 4)?.visible && (
              <Component4 
                isActive={activeComponent === 4} 
                setActive={() => setActiveComponent(4)}
              />
            )}
            
            {/* Component 5: Removable Component */}
            {components.find(c => c.id === 5)?.visible && (
              <Component5 
                isActive={activeComponent === 5} 
                setActive={() => setActiveComponent(5)}
                onRemove={() => handleRemoveComponent(5)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsPage;