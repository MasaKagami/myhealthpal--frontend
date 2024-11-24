"use client";

import { useEffect, useState } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function DoctorChat({ sessionId }: { sessionId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");

    try {
      const response = await fetch(`/api/messages/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", content: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      // Add AI response to the messages list
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.gptResponse.content },
      ]);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Chat Window */}
      <div className="h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">Start by typing your symptoms below.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat ${
                  message.sender === "user" ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input input-bordered flex-1 text-white"
        />
        <button onClick={handleSendMessage} className="btn btn-primary">
          Send
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}