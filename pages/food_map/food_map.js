// food_map.js
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import MapComponent from '../../api/GoogleMaps';

const App = () => {
  useEffect(() => {
    if (!window.root) {
      const appElement = document.getElementById('app');
      if (appElement) {
        window.root = createRoot(appElement);
        window.root.render(<MapComponent />);
      } else {
        console.error('No element with id "app" found');
      }
    }
  }, []);

  return <div id="app" />;
};

export default App;
