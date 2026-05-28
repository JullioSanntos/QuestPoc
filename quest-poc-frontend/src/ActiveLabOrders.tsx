import React, { useState, useEffect, useCallback } from 'react';

// 1. Strictly define the data shape coming down from your C# .NET Core API
export interface LabOrder {
  id: number | string;
  testName: string;
  patientId: string;
  status: string;
}

// 2. Define the props contract for the component
interface ActiveLabOrdersProps {
  /** Optional trigger to force the internal table data to refresh from the cloud database */
  refreshTrigger?: boolean;
}

export const ActiveLabOrders: React.FC<ActiveLabOrdersProps> = ({ refreshTrigger }) => {
  // --- Encapsulated Component State ---
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Type-safe API Data Fetch ---
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // NOTE: Using your exact local .NET API hosting port
      const response = await fetch('http://localhost:5056/api/diagnostics/orders');
      if (response.ok) {
        const data: LabOrder[] = await response.json();
        setOrders(data);
      } else {
        setError(`Server returned an error status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to connect to the backend database service.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on initial mount and whenever the parent tells us to refresh
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, refreshTrigger]);

  // Helper method to clean status names dynamically for class string assignment
  const formatBadgeClass = (statusString: string): string => {
    return statusString.toLowerCase().replace(/\s+/g, '');
  };

  return (
    <div className="active-orders-wrapper">
      {/* --- DATA TABLE CONTAINER --- */}
      <h3 className="grid-title" style={{ marginBottom: '12px' }}>
        Active Lab Orders (Simulated Microservice State)
      </h3>

      {/* Optional feedback states for better system readability */}
      {isLoading && <p style={{ color: '#666', fontStyle: 'italic' }}>Refreshing cloud data...</p>}
      {error && <p style={{ color: '#ef4444', fontWeight: 'bold' }}>{error}</p>}

      <table className="grid-container">
        <thead>
          <tr className="grid-header">
            <th>Order ID</th>
            <th>Diagnostic Test Name</th>
            <th>Patient ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && !isLoading ? (
            <tr>
              <td colSpan={4} className="grid-cell" style={{ textAlign: 'center', color: '#666' }}>
                No active lab orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td className="grid-cell" style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                  {order.id}
                </td>
                <td className="grid-cell">
                  {order.testName}
                </td>
                <td className="grid-cell">
                  {order.patientId}
                </td>
                <td className="grid-cell">
                  <span className={`badge badge-${formatBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};