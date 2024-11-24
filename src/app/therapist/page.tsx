/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/SpeechToTextPage.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";

import mutedBot from "@/assets/therapist_images/mute.png";
import talkingBot1 from "@/assets/therapist_images/talk1.png";
import talkingBot2 from "@/assets/therapist_images/talk2.png";
import talkingBot4 from "@/assets/therapist_images/talk4.png";

interface Session {
  id: number;
}

interface Message {
  id: number;
  session: {
    id: number;
  };
  sender: string; // 'user' or 'Therapist'
  content: string;
  timestamp: string;
}

interface MessageResponseDto {
  userMessage: Message;
  gptResponse: Message;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const SpeechToTextPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isBotTalking, setIsBotTalking] = useState(false);
  const [currentSequence, setCurrentSequence] = useState<StaticImageData[]>([
    mutedBot,
  ]);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const muteImage: StaticImageData = mutedBot;
  const talk1Image: StaticImageData = talkingBot1;
  const talk2Image: StaticImageData = talkingBot2;
  const talk4Image: StaticImageData = talkingBot4;

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Server error: ${response.statusText}`
          );
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
  }, []);

  useEffect(() => {
    if (!isBotTalking && !isRecording && sessionId !== null) {
      // Start recording automatically when the bot stops talking
      startRecording();
    }
  }, [isBotTalking]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const playTextToSpeech = async (text: string) => {
    try {
      setIsBotTalking(true);

      const response = await fetch("/api/textToSpeech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          languageCode: "en-US",
          voiceName: "en-US-Neural2-F", // Optimized voice
          audioEncoding: "MP3",
          audioConfig: {
            speakingRate: 1.15, // Slightly slower to convey calmness
            pitch: -0.5, // Slightly deeper tone for warmth
            volumeGainDb: 0.0, // Neutral volume
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get speech audio");
      }

      const data = await response.json();
      const audioContent = data.audioContent;

      const audioBytes = atob(audioContent);
      const arrayBuffer = new ArrayBuffer(audioBytes.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < audioBytes.length; i++) {
        uint8Array[i] = audioBytes.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(blob);

      const audio = new Audio(audioUrl);

      let imageInterval: NodeJS.Timeout;

      audio.onplay = () => {
        const randomImages = [talk1Image, talk2Image];
        // Shuffle the randomImages array
        for (let i = randomImages.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [randomImages[i], randomImages[j]] = [
            randomImages[j],
            randomImages[i],
          ];
        }
        // Select the first two images after shuffling
        const selectedRandomImages = randomImages.slice(0, 2);
        const sequence = [muteImage, ...selectedRandomImages, talk4Image];
        setCurrentSequence(sequence);
        setSequenceIndex(0);

        imageInterval = setInterval(() => {
          setSequenceIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % sequence.length;
            return nextIndex;
          });
        }, 175); // Change image every 175ms
      };

      audio.onended = () => {
        console.log("Audio playback finished.");
        setIsBotTalking(false);
        clearInterval(imageInterval);
        setCurrentSequence([muteImage]);
        setSequenceIndex(0);
      };

      audio.play();
    } catch (err) {
      console.error("Error playing text-to-speech audio:", err);
      setIsBotTalking(false);
    }
  };

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
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Speech recognition started.");
      setIsRecording(true);
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      console.log("Transcribed text:", speechResult);

      const userMessage: Message = {
        id: Date.now(),
        session: { id: sessionId! },
        sender: "You",
        content: speechResult,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        const response = await fetch(
          `${BASE_URL}/api/messages/therapy/${sessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            body: speechResult,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Server error: ${response.statusText}`
          );
        }

        const data: MessageResponseDto = await response.json();
        const gptMessage: Message = {
          id: Date.now() + 1,
          session: { id: sessionId! },
          sender: "Therapist",
          content: data.gptResponse.content,
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, gptMessage]);

        await playTextToSpeech(gptMessage.content);
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
      <header style={styles.header}>
        <h1 style={styles.title}>myhealthpal</h1>
      </header>
      <div style={styles.botImageContainer}>
        <Image
          src={currentSequence[sequenceIndex]}
          alt="Bot"
          width={200}
          height={200}
          style={styles.botImage}
        />
      </div>
      <div style={styles.chatContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "You" ? "#e0f7ff" : "#fff",
            }}
          >
            <strong>{msg.sender}:</strong>
            <p>{msg.content}</p>
            <span style={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.controls}>
        {isRecording ? (
          <button
            onClick={stopRecording}
            style={styles.stopButton}
            disabled={isBotTalking}
          >
            Stop Recording
          </button>
        ) : (
          <button
            onClick={startRecording}
            style={styles.startButton}
            disabled={isBotTalking}
          >
            Start Recording
          </button>
        )}
      </div>
      {error && (
        <div style={styles.errorContainer}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4faff",
    paddingBottom: "20px",
  },
  header: {
    width: "100%",
    backgroundColor: "#4a90e2",
    padding: "15px",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: 0,
  },
  botImageContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  botImage: {
    // Optional additional styling
  },
  chatContainer: {
    flex: 1,
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    marginTop: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  message: {
    maxWidth: "70%",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontSize: "14px",
  },
  timestamp: {
    display: "block",
    fontSize: "12px",
    color: "#999",
    marginTop: "5px",
    textAlign: "right",
  },
  controls: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    paddingBottom: "30px",
  },
  startButton: {
    backgroundColor: "#4a90e2",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  stopButton: {
    backgroundColor: "#e94e77",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  errorContainer: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#ffeded",
    color: "#d9534f",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "14px",
  },
};

export default SpeechToTextPage;
