import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const { imageContent } = await req.json();

    // Ensure the GOOGLE_API_KEY is set in the environment
    const GOOGLE_KEY = process.env.GOOGLE_API_KEY;
    if (!GOOGLE_KEY) {
      return NextResponse.json(
        { error: 'Google API Key not found' },
        { status: 500 }
      );
    }

    // Construct the Vision API request
    const visionRequestBody = {
      requests: [
        {
          image: {
            content: imageContent,
          },
          features: [
            {
              type: 'TEXT_DETECTION', // Use OCR to extract text
              maxResults: 10,
            },
          ],
        },
      ],
    };

    // Make the API call to Google Vision
    const visionApiResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visionRequestBody),
      }
    );

    const visionData = await visionApiResponse.json();

    // Handle response errors
    if (!visionApiResponse.ok) {
      return NextResponse.json(
        { error: visionData.error?.message || 'Unknown error' },
        { status: visionApiResponse.status }
      );
    }

    // Return the Vision API response to the client
    return NextResponse.json(visionData, { status: 200 });
  } catch (error) {
    console.error('Error in Vision API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
