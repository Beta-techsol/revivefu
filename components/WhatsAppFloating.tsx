"use client";
import { useState } from "react";

const WhatsAppFloating: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const phoneNumber = "+923154843593"; // Replace with your WhatsApp number

  const handleSend = () => {
    if (!message.trim()) return;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setIsOpen(false);
    setMessage("");
  };

  return (
    <>
      {/* Floating WhatsApp Icon */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 p-4 rounded-full cursor-pointer shadow-lg z-50 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          width="28"
          height="28"
        >
          <path d="M20.52 3.48A11.89 11.89 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.62 6l-1.6 5.84 5.94-1.56A11.87 11.87 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52zM12 21.6a9.58 9.58 0 0 1-5.1-1.46l-.36-.22-3.52.92.94-3.44-.23-.36A9.58 9.58 0 0 1 2.4 12c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6zm5.3-7.16c-.29-.15-1.7-.84-1.96-.93s-.46-.15-.66.15-.76.93-.93 1.12-.34.23-.63.08a7.78 7.78 0 0 1-2.29-1.41 8.63 8.63 0 0 1-1.59-1.96c-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.38-.02-.53-.07-.15-.66-1.58-.9-2.17-.23-.55-.47-.47-.66-.48h-.57c-.2 0-.53.08-.8.38s-1.05 1.03-1.05 2.5 1.08 2.9 1.23 3.1 2.13 3.24 5.15 4.54c.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.7-.69 1.94-1.35.24-.66.24-1.23.17-1.35-.07-.12-.27-.2-.56-.35z" />
        </svg>
      </div>

      {/* Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 bg-white shadow-lg rounded-lg p-4 w-72 z-50 border">
          <h4 className="font-semibold mb-2 text-gray-700">Chat on WhatsApp</h4>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded p-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Type your message..."
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppFloating;
