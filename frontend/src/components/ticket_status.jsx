import React, { useState } from "react";

function TicketStatus() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!ticketNumber) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/ticket/${ticketNumber}`);
      const data = await response.json();
      setTicketData(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Check Ticket Status</h3>

      <input
        type="text"
        placeholder="Enter Ticket Number"
        value={ticketNumber}
        onChange={(e) => setTicketNumber(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <button onClick={checkStatus}>Check Status</button>

      {loading && <p>Loading...</p>}

      {ticketData && !loading && (
        <div
          style={{
            border: "2px solid black",
            padding: "15px",
            marginTop: "15px",
            width: "300px",
            backgroundColor: "#000000",
            color: "#ffffff",
          }}
        >
          <p><strong>Ticket Number:</strong> {ticketData.Ticket}</p>
          <p><strong>Status:</strong> {ticketData.Status}</p>
        </div>
      )}
    </div>
  );
}

export default TicketStatus;
