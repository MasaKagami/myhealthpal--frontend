// src/components/SpeechToTextPage.tsx

"use client"; // Ensure this directive is at the top if you're using Next.js or similar frameworks

import React, { useState, useRef } from "react";

const SpeechToTextPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = () => {
    setError(null);
    setTranscribedText(null); // Clear previous transcription

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
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

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      console.log("Transcribed text:", speechResult);
      setTranscribedText(speechResult);
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
      <h1>Speech-to-Text Demo</h1>
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
      {transcribedText && (
        <div style={styles.resultContainer}>
          <h2>Transcribed Text:</h2>
          <p>{transcribedText}</p>
        </div>
      )}
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
    maxWidth: "600px",
    margin: "0 auto",
  },
  buttonContainer: {
    marginTop: "20px",
  },
  button: {
    padding: "15px 30px",
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
  resultContainer: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "5px",
  },
  errorContainer: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#ffe6e6",
    borderRadius: "5px",
    color: "red",
  },
};

export default SpeechToTextPage;
