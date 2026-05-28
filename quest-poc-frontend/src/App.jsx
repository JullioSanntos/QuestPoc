import React, { useState, useEffect } from 'react';

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pointing exactly to your live local .NET 10 Web API port
  const BACKEND_API_URL = 'https://localhost:7294/api/diagnostics/orders'; 

  useEffect(() => {
    fetch(BACKEND_API_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ borderBottom: '3px solid #005a9c', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#005a9c', margin: 0, fontSize: '2.2rem' }}>Quest Architecture Assessment</h1>
        <p style={{ color: '#555', marginTop: '0.5rem', fontSize: '1.1rem' }}>
          React SPA Single Page Application bound to an asynchronous .NET 10 Core API Tier
        </p>
      </header>

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Querying upstream diagnostics api gateway...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          <strong>Network Connectivity Error:</strong> {error}
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Tip: Ensure your Visual Studio backend project is actively running on port 7294 and that you accepted the local localhost SSL certificate in your browser.
          </p>
        </div>
      )}

      {!loading && !error && (
        <div>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>Active Lab Orders (Simulated Microservice State)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#005a9c', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '12px 15px' }}>Order ID</th>
                <th style={{ padding: '12px 15px' }}>Diagnostic Test Name</th>
                <th style={{ padding: '12px 15px' }}>Patient ID</th>
                <th style={{ padding: '12px 15px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#005a9c' }}>{order.id}</td>
                  <td style={{ padding: '12px 15px', color: '#333' }}>{order.testName}</td>
                  <td style={{ padding: '12px 15px', color: '#666', fontFamily: 'monospace' }}>{order.patientId}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      backgroundColor: order.status === 'Completed' ? '#d4edda' : order.status === 'In Progress' ? '#fff3cd' : '#f8d7da',
                      color: order.status === 'Completed' ? '#155724' : order.status === 'In Progress' ? '#856404' : '#721c24'
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;