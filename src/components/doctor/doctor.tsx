"use client";

import { useEffect, useState, useRef } from "react";

interface Message {
  id: number;
  session: { id: number };
  sender: string; // "user" or "ChatGPT"
  content: string;
  timestamp: string;
}

interface MessageResponseDto {
  userMessage: Message;
  gptResponse: Message;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function DoctorChat({ sessionId }: { sessionId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/messages/session/${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data: Message[] = await response.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load messages. Please refresh the page.");
      }
    };

    fetchMessages();
  }, [sessionId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      content: input.trim(),
      session: { id: sessionId },
    };

    setMessages((prev) => [
      ...prev,
      { ...userMessage, id: Date.now(), timestamp: new Date().toISOString() },
    ]);
    setInput("");

    try {
      const response = await fetch(`${BASE_URL}/api/messages/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMessage),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data: MessageResponseDto = await response.json();
      setMessages((prev) => [
        ...prev,
        { ...data.gptResponse, sender: "ChatGPT" },
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl">
      <div className="h-96 overflow-y-auto p-4 border rounded-lg bg-transparent border-none">
        {messages.length <= 2 ? (
          <p className="text-center flex items-center justify-center h-full text-gray-500">
            {/* Start by typing your symptoms below. */}
          </p>
        ) : (
          <div className="space-y-4">
            {messages.slice(2).map((message) => ( 
              <div
                key={message.id}
                className={`chat ${
                  message.sender === "user" ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-myblue">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center space-x-2 rounded-full border-4 border-myblue p-2">
        <input
          type="text"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input flex-1  bg-transparent placeholder-grey-400 border-none focus:text-gray-800 focus:bg-transparent focus:outline-none"
        />
        <button 
          onClick={handleSendMessage} 
          className="btn btn-circle bg-myblue hover:bg-gray-500 text-white border-none"
          disabled={!input.trim()}
          >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
