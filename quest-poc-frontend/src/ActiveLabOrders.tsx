import React, { useState, useEffect, useCallback } from 'react';

export interface LabOrder {
  id: number | string;
  testName: string;
  patientId: string;
  status: string;
}

interface ActiveLabOrdersProps {
  refreshTrigger?: boolean;
}

export const ActiveLabOrders: React.FC<ActiveLabOrdersProps> = ({ refreshTrigger }) => {
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5056/api/diagnostics/orders');
      if (response.ok) {
        const data: LabOrder[] = await response.json();
        setOrders(data);
      } else {
        setError(`Server returned an error status: ${response.status}`);
      }
    } catch (err) {
      setError("Failed to connect to the backend database service.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, refreshTrigger]);

  // --- Soft-Delete Integration ---
  const handleDeprecate = async (id: number | string) => {
    if (!window.confirm(`Are you sure you want to archive Order #${id}?`)) return;

    try {
      const response = await fetch(`http://localhost:5056/api/diagnostics/orders/${id}/deprecate`, {
        method: 'POST'
      });

      if (response.ok) {
        // Automatically re-fetch data to update the grid immediately
        fetchOrders();
      } else {
        alert(`Failed to deprecate order. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deprecating order:", err);
      alert("Network error occurred while trying to archive the order.");
    }
  };

  const formatBadgeClass = (statusString: string): string => {
    return statusString.toLowerCase().replace(/\s+/g, '');
  };

  return (
    <div className="active-orders-wrapper">
      <h3 className="grid-title" style={{ marginBottom: '12px' }}>
        Active Lab Orders (Simulated Microservice State)
      </h3>

      {isLoading && <p style={{ color: '#666', fontStyle: 'italic' }}>Refreshing cloud data...</p>}
      {error && <p style={{ color: '#ef4444', fontWeight: 'bold' }}>{error}</p>}

      <table className="grid-container">
        <thead>
          <tr className="grid-header">
            <th>Order ID</th>
            <th>Diagnostic Test Name</th>
            <th>Patient ID</th>
            <th>Status</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && !isLoading ? (
            <tr>
              <td colSpan={5} className="grid-cell" style={{ textAlign: 'center', color: '#666' }}>
                No active lab orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td className="grid-cell" style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                  {order.id}
                </td>
                <td className="grid-cell">{order.testName}</td>
                <td className="grid-cell">{order.patientId}</td>
                <td className="grid-cell">
                  <span className={`badge badge-${formatBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                {/* Action Column with the new button */}
                <td className="grid-cell" style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDeprecate(order.id)}
                    style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      padding: '4px 8px', 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      borderRadius: '4px'
                    }}
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};