"use client";
import React, { useState } from 'react';

const TextToSpeechForm: React.FC = () => {
  const [text, setText] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/textToSpeech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text,
            voiceType: "Journey",
            languageCode: 'en-US',
            voiceName: 'en-US-Journey-F', 
            audioEncoding: 'MP3',
            audioConfig: {
              speakingRate: 0.92, // Slightly slower to convey calmness
              pitch: -0.5, // Slightly deeper tone for warmth
              volumeGainDb: 0.0, // Neutral volume
            },
          }),
      });

      if (!response.ok) {
        throw new Error('Failed to synthesize speech');
      }

      const data = await response.json();
      setAudioSrc(`data:audio/mp3;base64,${data.audioContent}`);
    } catch (error) {
      console.error(error);
      alert('An error occurred while generating the speech.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to synthesize"
        />
        <button type="submit">Generate Speech</button>
      </form>
      {audioSrc && (
        <audio controls>
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default TextToSpeechForm;
