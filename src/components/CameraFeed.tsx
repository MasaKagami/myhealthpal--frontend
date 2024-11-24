/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

interface CameraFeedProps {
  onVisionResult: (visionResult: string) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onVisionResult }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [alertShown, setAlertShown] = useState(false);
  let detectionStartTime: number | null = null;

  useEffect(() => {
    let animationFrameId: number;
    let model: handpose.HandPose;

    const loadModel = async () => {
      await tf.ready();
      model = await handpose.load();
      console.log('Handpose model loaded.');

      startVideo();
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            detectHands();
          };
        }
      } catch (err) {
        console.error('Error accessing the camera:', err);
      }
    };

    const detectHands = async () => {
      if (videoRef.current && model) {
        const video = videoRef.current;

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const predictions = await model.estimateHands(video);

          if (predictions.length > 0) {
            if (detectionStartTime === null) {
              detectionStartTime = Date.now();
            } else if (Date.now() - detectionStartTime >= 2000 && !alertShown) {
              setAlertShown(true);
              captureFrame(); // Capture the frame and send it to Vision API
            }
          } else {
            detectionStartTime = null; // Reset timer if no hands are detected
          }
        }
      }
      animationFrameId = requestAnimationFrame(detectHands);
    };

    const captureFrame = () => {
      if (!videoRef.current) return;

      const video = videoRef.current;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              sendImageToVisionAPI(blob);
            }
          },
          'image/jpeg',
          0.95
        );
      }
    };

    const sendImageToVisionAPI = async (imageBlob: Blob) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];

        try {
          const response = await fetch('/api/vision', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageContent: base64data }),
          });

          const result = await response.json();

          if (response.ok) {
            console.log('Vision API response:', result);
            const textAnnotations = result.responses[0]?.textAnnotations || [];
            const detectedText = textAnnotations.map((item: any) => item.description).join(' ');

            // Send the detected text to the parent component
            onVisionResult(detectedText || 'No text detected.');
          } else {
            console.error('Error from Vision API proxy:', result.error);
            onVisionResult(`Error: ${result.error}`);
          }
        } catch (error) {
          console.error('Error calling Vision API proxy:', error);
          onVisionResult(`Error: ${error}`);
        }
      };
      reader.readAsDataURL(imageBlob);
    };

    loadModel();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        console.log('Camera stream stopped.');
      }
    };
  }, [alertShown, onVisionResult]);

  return (
    <div style={styles.container}>
      {/* Embed keyframes within a style tag */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -30%); }
            to { opacity: 1; transform: translate(-50%, -20%); }
          }
        `}
      </style>
      <div style={styles.videoWrapper}>
        <video
          ref={videoRef}
          style={styles.video}
          autoPlay
          playsInline
          muted
        ></video>
        {alertShown && (
          <div style={styles.popup}>
            <button style={styles.closeButton} onClick={() => setAlertShown(false)}>
              &times;
            </button>
            <div style={styles.popupContent}>
              <h2 style={styles.popupTitle}>Hand Detected!</h2>
              <p style={styles.popupMessage}>Capturing frame and processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  popup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '20px 30px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
    width: '80%',
    maxWidth: '400px',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#333',
    lineHeight: '1',
  },
  popupContent: {
    marginTop: '20px',
  },
  popupTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.5em',
    color: '#333',
  },
  popupMessage: {
    margin: 0,
    fontSize: '1em',
    color: '#555',
  },
};

// Adding keyframes within the component ensures they are loaded correctly
export default CameraFeed;
