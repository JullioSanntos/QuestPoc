import { useState, useEffect } from 'react';

function App() {
  // --- Existing State ---
  const [orders, setOrders] = useState([]);

  // --- New Form States ---
  const [testName, setTestName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [status, setStatus] = useState('Pending');

  // --- Existing Fetch Data Logic ---
  const fetchOrders = async () => {
    try {
      // NOTE: Verify this matches your local .NET API hosting port
      const response = await fetch('http://localhost:5056/api/diagnostics/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- New Handler to POST Data to SQL Server via API ---
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    
    // Quick client-side validation validation
    if (!testName.trim() || !patientId.trim()) {
      alert("Please fill out both the Test Name and Patient ID.");
      return;
    }

    const newOrder = { 
      testName: testName.trim(), 
      patientId: patientId.trim(), 
      status 
    };

    try {
      const response = await fetch('http://localhost:5056/api/diagnostics/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        // 1. Reset input form states on success
        setTestName('');
        setPatientId('');
        setStatus('Pending');
        
        // 2. Re-fetch fresh rows directly from SQL Server to update our table UI
        fetchOrders();
      } else {
        console.error("Server returned an error status:", response.status);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className="dashboard-card">
      {/* Main Title Section */}
      <h1 style={{ color: '#0ea5e9', marginBottom: '4px' }}>Quest Architecture Assessment</h1>
      <p className="subheader" style={{ margin: '0 0 40px 0' }}>
        React SPA Single Page Application bound to an asynchronous .NET 10 Core API Tier
      </p>

      <hr style={{ border: 'none', borderTop: '2px solid #1d4ed8', marginBottom: '30px' }} />

      {/* --- NEW FORM COMPONENT: Inserts entries into SQL Server --- */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Create New Lab Order</h3>
        <form onSubmit={handleCreateOrder} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Diagnostic Test Name (e.g., Lipid Panel)" 
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff', flex: 1 }}
          />
          <input 
            type="text" 
            placeholder="Patient ID (e.g., PT-1234)" 
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff', width: '180px' }}
          />
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff', cursor: 'pointer' }}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            Add Order
          </button>
        </form>
      </div>

      {/* --- DATA TABLE CONTAINER --- */}
      <h3 className="grid-title" style={{ marginBottom: '12px' }}>Active Lab Orders (Simulated Microservice State)</h3>
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
          {orders.map((order) => (
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
                <span className={`badge badge-${order.status.toLowerCase().replace(/\s+/g, '')}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;