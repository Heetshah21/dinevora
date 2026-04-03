export default function Loading() {
    const card = {
      background: "#e5e7eb",
      borderRadius: "10px",
      height: "80px",
      animation: "pulse 1.5s infinite",
    };
  
    return (
      <div>
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `}
        </style>
  
        <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>
  
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={card} />
          ))}
        </div>
      </div>
    );
  }