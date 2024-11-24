import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { text, languageCode, voiceName, audioEncoding, audioConfig } = await req.json();

    if (!text || !languageCode || !audioEncoding || !audioConfig) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google API key is not configured.' },
        { status: 500 }
      );
    }

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const response = await axios.post(
      url,
      {
        input: { text },
        voice: {
          languageCode,
          name: voiceName, // Use the selected voice
        //   model: "en-US-Journey", // Use the Journey model
        },
        audioConfig: {
          audioEncoding,
          speakingRate: audioConfig.speakingRate,
          pitch: audioConfig.pitch,
          volumeGainDb: audioConfig.volumeGainDb,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Text-to-Speech API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to process text-to-speech request' },
      { status: 500 }
    );
  }
}
