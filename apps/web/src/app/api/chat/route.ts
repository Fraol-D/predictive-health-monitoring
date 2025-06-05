import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    // Construct a prompt for a conversational chat
    const prompt = `
      You are a friendly and helpful AI Health Assistant. 
      Your role is to provide safe, general health information and encouragement.
      Do not provide medical diagnoses or prescribe treatments. 
      If asked for a diagnosis or prescription, you must politely decline and advise the user to consult a healthcare professional.
      
      Current Conversation:
      ${(history || []).map((msg: {sender: string, text: string}) => `${msg.sender}: ${msg.text}`).join('\n')}
      user: ${message}
      ai:
    `;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 256,
      },
       safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      return NextResponse.json({ error: `Gemini API Error: ${res.status} ${errorBody}` }, { status: res.status });
    }

    const responseData = await res.json();
    const textOutput = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (textOutput) {
      return NextResponse.json({ reply: textOutput });
    } else {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 500 });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
} 