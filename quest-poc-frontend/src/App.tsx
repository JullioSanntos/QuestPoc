import React, { useState } from 'react';
import { CreateLabOrder } from './CreateLabOrder';
import { ActiveLabOrders } from './ActiveLabOrders';

export const App: React.FC = () => {
  // The single source of truth toggle to bridge the two components together
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  const handleOrderCreated = () => {
    // Simply flip the boolean to force ActiveLabOrders to execute its data fetch
    setRefreshTrigger(prev => !prev);
  };

  return (
    <div className="app-container" style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      
      {/* 1. Self-contained Form component */}
      <CreateLabOrder onOrderCreated={handleOrderCreated} />

      <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', marginBottom: '40px' }} />

      {/* 2. Self-contained Data Table component */}
      <ActiveLabOrders refreshTrigger={refreshTrigger} />
      
    </div>
  );
};

export default App;