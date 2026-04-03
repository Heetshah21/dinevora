export default function Loading() {
    const skeleton = {
      background: "#e5e7eb",
      borderRadius: "8px",
      height: "14px",
      marginBottom: "8px",
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
  
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Orders</h1>
  
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e5e7eb",
              padding: "16px",
              borderRadius: "10px",
              marginBottom: "14px",
              background: "#fff",
            }}
          >
            <div style={{ ...skeleton, width: "120px" }} />
            <div style={{ ...skeleton, width: "80px" }} />
            <div style={{ ...skeleton, width: "60%" }} />
            <div style={{ ...skeleton, width: "40%" }} />
          </div>
        ))}
      </div>
    );
  }