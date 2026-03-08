import React from 'react';
import { X } from 'lucide-react';

export function TestHologram() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#000', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#ffdf7e', marginBottom: '20px' }}>🚀 Test Hologram</h1>
        <p>If you see this, React is working!</p>
        <button
          onClick={() => window.history.back()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#ffdf7e',
            color: '#000',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back to Home
        </button>
      </div>
      
      {/* Exit button */}
      <button
        onClick={() => window.history.back()}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          background: 'rgba(255,255,255,0.1)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white'
        }}
      >
        <X size={24} />
      </button>
    </div>
  );
}