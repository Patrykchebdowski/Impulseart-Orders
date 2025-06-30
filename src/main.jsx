
import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>ImpulseArt Orders</h1>
      <p>This is your orders dashboard. Full app logic goes here.</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
