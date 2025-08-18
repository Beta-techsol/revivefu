"use client";
import React, { useState, useEffect } from "react";

interface WhatsAppWidgetProps {
  phoneNumber: string; // e.g. "923154843593"
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ phoneNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const suggestedMessages = [
    "Hi! I'd like to know more about your furniture collection.",
    "Can you share your latest furniture catalog and prices?",
    "I want to order a custom sofa set.",
    "Do you have any discounts on dining tables right now?",
  ];

  // detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openWhatsApp = (msg: string) => {
    if (!msg.trim()) return;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: isMobile ? "100px" : "40px", // more margin on mobile
          right: "20px",
          backgroundColor: "#25D366",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 9999,
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          style={{ width: "32px", height: "32px" }}
        />
      </div>

      {/* Popup */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: isMobile ? "130px" : "90px", // shift higher on mobile too
            right: "20px",
            width: "300px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            zIndex: 10000,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#25D366",
              color: "#fff",
              padding: "12px",
              fontWeight: "bold",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Typical reply in minutes.</span>
            <span
              style={{
                cursor: "pointer",
                fontWeight: "normal",
                fontSize: "18px",
                lineHeight: "1",
              }}
              onClick={() => setIsOpen(false)}
            >
              ✕
            </span>
          </div>

          {/* Suggested Messages */}
          <div style={{ padding: "10px" }}>
            {suggestedMessages.map((msg, i) => (
              <div
                key={i}
                onClick={() => openWhatsApp(msg)}
                style={{
                  background: "#f5f5f5",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  marginBottom: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                {msg}
              </div>
            ))}

            {/* Custom Message Input */}
            <textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                fontSize: "13px",
                marginTop: "8px",
                resize: "none",
              }}
              rows={3}
            />

            {/* Send Button */}
            <button
              onClick={() => openWhatsApp(message)}
              disabled={!message.trim()}
              style={{
                marginTop: "8px",
                background: "#25D366",
                color: "#fff",
                border: "none",
                padding: "8px",
                width: "100%",
                borderRadius: "6px",
                cursor: message.trim() ? "pointer" : "not-allowed",
                fontSize: "14px",
              }}
            >
              Send on WhatsApp
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
