"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function DoctorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Simulated AI response
  const getAIResponse = async (userMessage: string) => {
    // Replace this with your AI API logic
    const response = await fetch("/api/ai-doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    return data.reply || "I'm sorry, I didn't understand that. Can you try again?";
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");

    try {
      const aiReply = await getAIResponse(userMessage);
      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (err) {
      setError("Failed to get a response from the AI. Please try again.");
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
          className="input input-bordered flex-1"
        />
        <button onClick={handleSendMessage} className="btn btn-primary">
          Send
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
