import React, { useState } from 'react';

// Define the contract for what this component requires from its parent
interface CreateLabOrderProps {
  /** Callback function triggered immediately after a successful POST to the database */
  onOrderCreated: () => void;
}

export const CreateLabOrder: React.FC<CreateLabOrderProps> = ({ onOrderCreated }) => {
  // --- Isolated Form States ---
  const [testName, setTestName] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('');
  const [status, setStatus] = useState<string>('Pending');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- Strongly Typed Form Submission Event ---
  const handleCreateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Client-side validation
    if (!testName.trim() || !patientId.trim()) {
      alert("Please fill out both the Test Name and Patient ID.");
      return;
    }

    const newOrder = { 
      testName: testName.trim(), 
      patientId: patientId.trim(), 
      status 
    };

    setIsSubmitting(true);
    try {
      // Connecting to your active local .NET API hosting port
      const response = await fetch('http://localhost:5056/api/diagnostics/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        // 1. Reset input form states cleanly on success
        setTestName('');
        setPatientId('');
        setStatus('Pending');
        
        // 2. Safely notify the parent hub to cycle the refresh trigger
        onOrderCreated();
      } else {
        console.error("Server returned an error status:", response.status);
        alert(`Failed to save order. Server status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Network error: Could not reach the backend database service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper" style={{ marginBottom: '40px' }}>
      <h3 className="grid-title" style={{ marginBottom: '12px' }}>
        Create New Lab Order
      </h3>
      <form 
        onSubmit={handleCreateOrder} 
        className="grid-container" 
        style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}
      >
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Test Name</label>
          <input 
            type="text" 
            value={testName} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestName(e.target.value)} 
            placeholder="e.g. Comprehensive Metabolic Panel"
            style={{ padding: '6px', width: '250px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Patient ID</label>
          <input 
            type="text" 
            value={patientId} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientId(e.target.value)} 
            placeholder="e.g. PT-99482"
            style={{ padding: '6px', width: '150px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Status</label>
          <select 
            value={status} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)} 
            style={{ padding: '6px' }}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          style={{ padding: '6px 16px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isSubmitting ? 'Saving...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
};