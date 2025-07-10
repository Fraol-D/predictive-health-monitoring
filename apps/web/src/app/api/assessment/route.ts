import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCDxRePxoKeOgODUwd3OMWyK0tv2Tx4Oj8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001/api';

export async function POST(request: Request) {
  try {
    const { userId: firebaseUID, assessmentId, ...fullAssessmentData } = await request.json();

    if (!firebaseUID || !assessmentId || !fullAssessmentData) {
      return NextResponse.json({ error: 'Missing firebaseUID, assessmentId, or full assessment data.' }, { status: 400 });
    }

    // 1. Ensure user exists in our MongoDB and get their MongoDB _id
    let mongoUserId;
    try {
      let userResponse = await fetch(`${BACKEND_API_BASE_URL}/users/firebase/${firebaseUID}`);
      let userData = await userResponse.json();

      if (userResponse.status === 404) {
        // User not found in MongoDB, create them
        const newUserResponse = await fetch(`${BACKEND_API_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firebaseUID, name: 'New User', email: `${firebaseUID}@example.com` }), // Placeholder name/email
        });
        if (!newUserResponse.ok) {
          const errorBody = await newUserResponse.text();
          throw new Error(`Failed to create user in backend: ${newUserResponse.status} ${errorBody}`);
        }
        const newUserData = await newUserResponse.json();
        mongoUserId = newUserData._id;
      } else if (userResponse.ok) {
        mongoUserId = userData._id;
      } else {
        const errorBody = await userResponse.text();
        throw new Error(`Failed to fetch user from backend: ${userResponse.status} ${errorBody}`);
      }
    } catch (e) {
      console.error('Error ensuring user in backend:', e);
      return NextResponse.json({ error: `Backend user synchronization failed: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 });
    }

    if (!GEMINI_API_KEY) {
      console.error('Gemini API key is not configured.');
      return NextResponse.json({ error: 'API key not configured. Please set GEMINI_API_KEY environment variable.' }, { status: 500 });
    }
    
    const prompt = `
      Analyze the following user health data and provide a risk assessment.
      User Data: ${JSON.stringify(fullAssessmentData, null, 2)}

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
      },
       safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error('Gemini API request failed:', geminiResponse.status, errorBody);
      return NextResponse.json({ error: `Gemini API Error: ${geminiResponse.status} ${errorBody}` }, { status: geminiResponse.status });
    }

    const responseData = await geminiResponse.json();
    
    const textOutput = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
    let riskScores;
    if (textOutput) {
      try {
        riskScores = JSON.parse(textOutput);
      } catch (parseError) {
        console.error('Failed to parse Gemini response text as JSON:', textOutput, parseError);
        return NextResponse.json({ error: 'Gemini API returned malformed JSON.', details: textOutput }, { status: 500 });
      }
    } else {
      console.error('Unexpected Gemini API response structure:', responseData);
      return NextResponse.json({ error: 'Unexpected response structure from Gemini API.' }, { status: 500 });
    }

    // 2. Save full assessment data and Gemini response to our Node.js backend
    const backendAssessmentResponse = await fetch(`${BACKEND_API_BASE_URL}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: mongoUserId,
        assessmentId: assessmentId,
        fullAssessmentData: fullAssessmentData, // Pass the entire assessment data object
        riskScores: riskScores,
      }),
    });

    if (!backendAssessmentResponse.ok) {
      const errorBody = await backendAssessmentResponse.text();
      console.error('Backend assessment save failed:', backendAssessmentResponse.status, errorBody);
      throw new Error(`Failed to save assessment to backend: ${backendAssessmentResponse.status} ${errorBody}`);
    }
    
    const savedAssessment = await backendAssessmentResponse.json();
    console.log('Assessment saved to backend:', savedAssessment);

    // Return the Gemini result to the frontend as originally intended
    return NextResponse.json(riskScores);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error processing assessment request:', error);
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
} 