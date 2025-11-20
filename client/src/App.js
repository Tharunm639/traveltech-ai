import { useState } from "react";
import axios from "axios";

function App() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItinerary("");

    // Temporary placeholder response — will connect AI later
    try {
      const response = await axios.get("http://localhost:5000/");
      setItinerary(
        `Trip planned to ${destination} for ${days} days within ₹${budget} budget.\n\n${response.data}`
      );
    } catch (error) {
      setItinerary("❌ Could not connect to backend.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "40px",
        fontFamily: "Segoe UI, sans-serif",
        background: "#f8f9fa",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <h1 style={{ color: "#0077cc", marginBottom: "30px" }}>
        🌍 TravelTech Trip Planner
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          margin: "auto",
          background: "#fff",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Goa, Paris"
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Number of Days:</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="e.g. 5"
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Budget (₹):</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 15000"
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "5px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#0077cc",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Planning..." : "Generate Itinerary"}
        </button>
      </form>

      {itinerary && (
        <div
          style={{
            background: "white",
            maxWidth: "600px",
            margin: "40px auto",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            whiteSpace: "pre-line",
          }}
        >
          <h2 style={{ color: "#0077cc" }}>🧳 Your Trip Plan</h2>
          <p>{itinerary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
