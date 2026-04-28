"use client";

import { useEffect, useState } from "react";

export default function FailPage() {
  const [message, setMessage] = useState("Payment could not be completed.");

  useEffect(() => {
    // 🔐 Break out of iframe (3DS case)
    if (window.top !== window.self && window.top) {
      window.top.location.href = window.self.location.href;
      return;
    }

    // Optional: extract message from URL if passed
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("message");

    if (msg) {
      setMessage(msg);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ color: "red" }}>❌ Payment Failed</h1>
      <p style={{ marginTop: "10px" }}>{message}</p>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "10px 20px",
            background: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}