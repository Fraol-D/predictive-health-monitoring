import { NextResponse } from 'next/server';
import { getOrCreateMongoUserId } from '@/lib/auth-service';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to parse potentially malformed JSON from Gemini response
function parseGeminiJson(jsonString: string): any {
  try {
    // Remove markdown backticks and 'json' language identifier
    const cleanedString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedString);
  } catch (e) {
    console.error("Failed to parse Gemini JSON response:", e);
    console.error("Original string:", jsonString);
    return null; // Or handle error as needed
  }
}

export async function POST(request: Request) {
  try {
    const { firebaseUID, ...assessmentData } = await request.json();

    if (!firebaseUID) {
      return NextResponse.json({ error: 'Missing firebaseUID' }, { status: 400 });
    }
    if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY not configured.');
        return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }

    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);

    // 1. Save the initial assessment to get an ID
    const initialAssessmentResponse = await fetch(`${BACKEND_API_BASE_URL}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: mongoUserId, ...assessmentData }),
    });

    if (!initialAssessmentResponse.ok) {
        const errorBody = await initialAssessmentResponse.text();
        return NextResponse.json({ error: 'Failed to save initial assessment', details: errorBody }, { status: 500 });
    }
    const savedAssessment = await initialAssessmentResponse.json();
    const assessmentId = savedAssessment._id;

    // 2. Format data for Gemini prompt for structured JSON output
    const prompt = `
      Based on the following health assessment data, please generate a detailed health report.
      The output MUST be a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON object.
      The JSON object should have two top-level keys: "reportSummary" and "recommendations".
      
      - "reportSummary": A string containing a comprehensive, yet easy-to-understand summary of the health status, key risks, and overall wellness based on the data.
      - "recommendations": An array of objects. Each object should have two keys:
        - "category": A string from one of the following categories: "Diet", "Lifestyle", "Medical", "Fitness".
        - "recommendation": A string containing a specific, actionable recommendation.

      Here is the assessment data:
      ${JSON.stringify(assessmentData, null, 2)}
    `;

    // 3. Call Gemini API
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json" },
        }),
    });
    
    if (!geminiResponse.ok) {
        const errorBody = await geminiResponse.text();
        console.error('Gemini API Error:', errorBody);
        // Even if Gemini fails, we have the base assessment saved.
        // We can return the saved assessment and log the AI error.
        return NextResponse.json(savedAssessment);
    }
    
    const responseData = await geminiResponse.json();
    const geminiOutputText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!geminiOutputText) {
        console.error('Gemini response was empty.');
        return NextResponse.json(savedAssessment);
    }
    
    const structuredResponse = parseGeminiJson(geminiOutputText);

    if (structuredResponse && structuredResponse.reportSummary && structuredResponse.recommendations) {
        // 4. Update the assessment with the report summary
        await fetch(`${BACKEND_API_BASE_URL}/assessments/${assessmentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reportSummary: structuredResponse.reportSummary }),
        });

        // 5. Save each recommendation
        for (const rec of structuredResponse.recommendations) {
            await fetch(`${BACKEND_API_BASE_URL}/recommendations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: mongoUserId,
                    assessmentId: assessmentId,
                    category: rec.category,
                    recommendation: rec.recommendation, // The 'recommendation' field from the AI
                }),
            });
        }
    } else {
        console.error("Parsed Gemini response did not have the expected structure.", structuredResponse);
    }

    // 6. Fetch the fully updated assessment to return to the frontend
    const finalAssessmentResponse = await fetch(`${BACKEND_API_BASE_URL}/reports/${assessmentId}`);
    const finalAssessment = await finalAssessmentResponse.json();
    
    return NextResponse.json(finalAssessment);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error processing assessment request:', error);
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
} 