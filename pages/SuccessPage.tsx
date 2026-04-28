"use client";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    if (window.top !== window.self && window.top) {
      window.top.location = window.self.location.href; 
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("failed");
      setMessage("Token not found in URL");
      return;
    }

    // 🔓 Decode Base64 token
    const decodeToken = (token: string) => {
      try {
        return JSON.parse(atob(token));
      } catch {
        return null;
      }
    };

    const decoded = decodeToken(token);

    if (!decoded?.id) {
      setStatus("failed");
      setMessage("Invalid token structure");
      return;
    }

    const { id, oprSecret } = decoded;

    verifyPayment(id, oprSecret);
  }, []);

  const verifyPayment = async (id: string, papInfo?: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/merchant-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            papInfo,
          }),
        }
      );

      const result = await res.json();

      // 💾 store full response
      setPaymentData(result?.data || null);

      // ⚠️ Always show success page (as you requested)
      setStatus("success");
      setMessage(result?.message || "Payment processed");
    } catch (error) {
      setStatus("failed");
      setMessage("Network/server error");
    }
  };

  return (

    <>
    
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {status === "loading" && <h2>Verifying payment...</h2>}

      {/* ✅ ALWAYS show success UI if API responded */}
      {status === "success" && (
        <>
          <h1 style={{ color: "green" }}>✅ Payment Successful</h1>
          <p>{message}</p>

          {paymentData && (
            <div style={{ marginTop: "20px" }}>
              <h3>Transaction Details</h3>
              <p><b>Status:</b> {paymentData.status}</p>
              <p><b>Amount:</b> {paymentData.amount}</p>
              <p><b>Currency:</b> {paymentData.currency}</p>
              <p><b>Client ID:</b> {paymentData.clientId}</p>
              <p><b>Remarks:</b> {paymentData.remarks}</p>
            </div>
          )}
        </>
      )}

      {status === "failed" && (
        <>
          <h1 style={{ color: "red" }}>❌ Payment Failed</h1>
          <p>{message}</p>
        </>
      )}
    </div>
    </>
  );
}