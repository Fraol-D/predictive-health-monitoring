import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCDxRePxoKeOgODUwd3OMWyK0tv2Tx4Oj8'; // Fallback to the one you provided, but ideally use env var
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    if (!GEMINI_API_KEY) {
      console.error('Gemini API key is not configured.');
      return NextResponse.json({ error: 'API key not configured. Please set GEMINI_API_KEY environment variable.' }, { status: 500 });
    }
    
    const prompt = `
      Analyze the following user health data and provide a risk assessment.
      User Data: ${JSON.stringify(userData, null, 2)}

      Based on this data, return a JSON object with three main keys: "diabetes", "hypertension", and "heartDisease".
      Each key should correspond to an object with the following structure:
      - "score": A numerical risk score between 0 and 100.
      - "level": A risk level string, which must be one of "Low", "Medium", "High", or "Very High".
      - "description": A brief, one-sentence explanation for the assessment.

      Do not include any text, notes, or explanations outside of the main JSON object.
    `;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    };

    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Gemini API request failed:', res.status, errorBody);
      return NextResponse.json({ error: `Gemini API Error: ${res.status} ${errorBody}` }, { status: res.status });
    }

    const responseData = await res.json();
    
    const textOutput = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (textOutput) {
      // The API should return a clean JSON string because we set responseMimeType
      try {
        // No need to parse, the fetch response is already a JSON object if the API respects the mime type.
        // If the API returns a string that *contains* JSON, we'd parse it.
        // Let's trust the response is JSON for now, as that's what we requested.
        return NextResponse.json(JSON.parse(textOutput));
      } catch (parseError) {
        console.error('Failed to parse Gemini response text as JSON:', textOutput, parseError);
        return NextResponse.json({ error: 'Gemini API returned malformed JSON.', details: textOutput }, { status: 500 });
      }
    } else {
      console.error('Unexpected Gemini API response structure:', responseData);
      return NextResponse.json({ error: 'Unexpected response structure from Gemini API.' }, { status: 500 });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error processing assessment request:', error);
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
} 