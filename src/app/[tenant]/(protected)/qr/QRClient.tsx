"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function QRClient({ shortCode }: { shortCode: string }) {
  const [count, setCount] = useState("");
  const [qrs, setQrs] = useState<any[]>([]);

  const generateQR = async () => {
    const total = Number(count);
    const arr = [];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    for (let i = 1; i <= total; i++) {
      const url = `${baseUrl}/m/${shortCode}?table=${i}`;
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
        className="servoraFullWidthMobileInput servoraNoRightMarginMobile"
        style={{ padding: "10px", marginRight: "10px" }}
      />

      <button onClick={generateQR} style={{
              padding: "8px 12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
            }}>Generate QR Codes</button>

      <div style={{ marginTop: "30px" }}>
        {qrs.map((q) => (
          <div key={q.table} style={{ marginBottom: "20px" }}>
            <h3>Table {q.table}</h3>
            <img src={q.qr} style={{ width: "150px" }} />
            <p>{q.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}