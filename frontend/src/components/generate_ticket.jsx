import React, { useState } from "react";

function GenerateTicket() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ticket");
      const data = await response.json();
      setTicket(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <button onClick={fetchTicket}>Generate Ticket</button>

      {loading && <p>Loading...</p>}

      {ticket && !loading && (
        <div
          style={{
            border: "2px solid black",
            padding: "20px",
            marginTop: "20px",
            width: "300px",
            backgroundColor: "#000000",
            color: "#ffffff",
          }}
        >
          <h3>Ticket Info</h3>
          <p><strong>Ticket Number:</strong> {ticket.Ticket}</p>
        </div>
      )}
    </div>
  );
}

export default GenerateTicket;

