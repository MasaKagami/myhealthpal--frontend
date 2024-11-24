'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import type { NextPage } from 'next';

const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [alertShown, setAlertShown] = useState(false);
  const [visionResult, setVisionResult] = useState<string | null>(null);
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

            // Store the detected text in the state
            setVisionResult(detectedText || 'No text detected.');
          } else {
            console.error('Error from Vision API proxy:', result.error);
            setVisionResult(`Error: ${result.error}`);
          }
        } catch (error) {
          console.error('Error calling Vision API proxy:', error);
          setVisionResult(`Error: ${error}`);
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
      }
    };
  }, [alertShown]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <video
        ref={videoRef}
        style={{
          width: '500px',
          height: 'auto',
          border: '2px solid black',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        autoPlay
        playsInline
        muted
      ></video>
      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          width: '80%',
          maxHeight: '300px',
          overflowY: 'scroll',
          textAlign: 'left',
          fontFamily: 'monospace',
        }}
      >
        <h3>Detected Text:</h3>
        <pre>{visionResult || 'No result yet.'}</pre>
      </div>
    </div>
  );
};

const Page: NextPage = () => {
  return <CameraFeed />;
};

export default Page;
