import React from 'react';
import './App.css';
import DDNS from './dDNS'; // Import the DDNS component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>dDNS Service</h1>
        <DDNS /> {/* Add the DDNS component here */}
      </header>
    </div>
  );
}

export default App;