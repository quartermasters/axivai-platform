import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Placeholder components
const Login = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>AXIVAI Platform</h1>
    <form style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <input 
          type="email" 
          placeholder="Email" 
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          defaultValue="test@example.com"
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input 
          type="password" 
          placeholder="Password" 
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          defaultValue="testpassword"
        />
      </div>
      <button type="submit" style={{ width: '100%', padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
        Sign In
      </button>
    </form>
  </div>
);

const Dashboard = () => (
  <div style={{ padding: '2rem' }}>
    <h1>AXIVAI Dashboard</h1>
    <p>Welcome to the AXIVAI Platform - Venture Validation System</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;