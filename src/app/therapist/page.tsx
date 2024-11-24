/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/SpeechToTextPage.tsx

"use client"; // Ensure this directive is at the top if you're using Next.js or similar frameworks

import React, { useState, useRef, useEffect } from "react";

// TypeScript Interfaces
interface Session {
  id: number;
  // Add other session fields if needed
}

interface Message {
  id: number;
  session: {
    id: number;
    // Add other session fields if needed
  };
  sender: string; // 'user' or 'ChatGPT'
  content: string;
  timestamp: string;
}

interface MessageResponseDto {
  userMessage: Message;
  gptResponse: Message;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"; // Replace with your actual backend base URL

const SpeechToTextPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // State to hold all messages
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // For auto-scrolling

  // Create a therapy session on component mount
  useEffect(() => {
    const createTherapySession = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/sessions/therapy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // Attempt to parse error message from response
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.statusText}`);
        }

        const session: Session = await response.json();
        setSessionId(session.id);
        console.log("Therapy session created with ID:", session.id);
      } catch (err: any) {
        console.error("Failed to create therapy session:", err);
        setError("Failed to create therapy session. Please try again later.");
      }
    };

    createTherapySession();
  }, [BASE_URL]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const startRecording = () => {
    if (sessionId === null) {
      setError("Session not initialized. Please refresh the page.");
      return;
    }

    setError(null);

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    recognition.lang = "en-US"; // Set language
    recognition.interimResults = false; // Get final results only
    recognition.maxAlternatives = 1; // Number of alternative transcriptions

    recognition.onstart = () => {
      console.log("Speech recognition started.");
      setIsRecording(true);
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      console.log("Transcribed text:", speechResult);

      // Append user's message to the messages list
      const userMessage: Message = {
        id: Date.now(), // Temporary ID; ideally, use backend-generated ID
        session: { id: sessionId },
        sender: "user",
        content: speechResult,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        const response = await fetch(`${BASE_URL}/api/messages/therapy/${sessionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: speechResult,
        });

        if (!response.ok) {
          // Attempt to parse error message from response
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.statusText}`);
        }

        const data: MessageResponseDto = await response.json();
        console.log("GPT Response:", data.gptResponse.content);

        // Append GPT's response to the messages list
        const gptMessage: Message = {
          id: Date.now() + 1, // Temporary ID; ideally, use backend-generated ID
          session: { id: sessionId },
          sender: "Therapist",
          content: data.gptResponse.content,
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, gptMessage]);
      } catch (err: any) {
        console.error("Failed to send message:", err);
        setError("Failed to send message. Please try again.");
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      setIsRecording(false);
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div style={styles.container}>
      <h1>Speech-to-Text Therapy Chat</h1>
      {sessionId ? (
        <div style={styles.buttonContainer}>
          {isRecording ? (
            <button
              onClick={stopRecording}
              style={{ ...styles.button, ...styles.stopButton }}
            >
              Stop Recording
            </button>
          ) : (
            <button
              onClick={startRecording}
              style={{ ...styles.button, ...styles.startButton }}
            >
              Start Recording
            </button>
          )}
        </div>
      ) : (
        <p>Initializing session...</p>
      )}
      <div style={styles.chatContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#FFF",
            }}
          >
            <strong>{msg.sender === "user" ? "You" : "Therapist"}:</strong>
            <p>{msg.content}</p>
            <span style={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div style={styles.errorContainer}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

// Inline styles for simplicity
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  buttonContainer: {
    marginTop: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginRight: "10px",
  },
  startButton: {
    backgroundColor: "#28a745", // Green
    color: "white",
  },
  stopButton: {
    backgroundColor: "#dc3545", // Red
    color: "white",
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
    boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
  },
  timestamp: {
    display: "block",
    fontSize: "12px",
    color: "#999",
    marginTop: "5px",
    textAlign: "right",
  },
  errorContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#ffe6e6",
    borderRadius: "5px",
    color: "red",
  },
};

export default SpeechToTextPage;
