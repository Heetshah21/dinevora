"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function QRClient({ tenant }: { tenant: string }) {
  const [count, setCount] = useState("");
  const [qrs, setQrs] = useState<any[]>([]);

  const generateQR = async () => {
    const total = Number(count);
    const arr = [];

    for (let i = 1; i <= total; i++) {
      const url = `http://localhost:3000/r/${tenant}/menu?table=${i}`;
      const qr = await QRCode.toDataURL(url);

      arr.push({
        table: i,
        qr,
        url,
      });
    }

    setQrs(arr);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>QR Code Generator</h1>

      <input
        placeholder="Number of Tables"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginRight: "10px",
        }}
      />

      <button
        onClick={generateQR}
        style={{
          padding: "10px 14px",
          background: "#111",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Generate QR Codes
      </button>

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {qrs.map((q) => (
          <div
            key={q.table}
            style={{
              border: "1px solid #eee",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "center",
              background: "white",
            }}
          >
            <h3>Table {q.table}</h3>
            <img src={q.qr} style={{ width: "150px" }} />
            <p style={{ fontSize: "12px" }}>{q.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}