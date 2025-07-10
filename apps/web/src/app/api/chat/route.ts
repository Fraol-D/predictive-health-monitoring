import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001/api';

// Helper to ensure user exists in MongoDB and return their MongoDB _id
async function getOrCreateMongoUserId(firebaseUID: string) {
  let mongoUserId;
  try {
    let userResponse = await fetch(`${BACKEND_API_BASE_URL}/users/firebase/${firebaseUID}`);
    let userData = await userResponse.json();

    if (userResponse.status === 404) {
      const newUserResponse = await fetch(`${BACKEND_API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseUID, name: 'New User', email: `${firebaseUID}@example.com` }),
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
    throw new Error(`Backend user synchronization failed: ${e instanceof Error ? e.message : String(e)}`);
  }
  return mongoUserId;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const firebaseUID = url.pathname.split('/').pop(); // Extract firebaseUID from path

  if (!firebaseUID) {
    return NextResponse.json({ error: 'Missing Firebase UID for fetching chats.' }, { status: 400 });
  }

  try {
    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);

    const response = await fetch(`${BACKEND_API_BASE_URL}/chat/user/${mongoUserId}`);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch chats from backend: ${response.status} ${errorBody}`);
    }
    const chats = await response.json();
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chat history.', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId: firebaseUID, chatId, title, message, history } = await request.json();

    if (!firebaseUID || !chatId || !message) {
      return NextResponse.json({ error: 'Missing required chat data (userId, chatId, message).', received: { firebaseUID, chatId, message: message ? "[present]" : "[missing]" } }, { status: 400 });
    }

    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);

    // 1. Send message to our Node.js backend for persistence
    const backendChatResponse = await fetch(`${BACKEND_API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: mongoUserId,
        chatId: chatId,
        title: title,
        message: { role: message.sender, content: message.text, timestamp: message.timestamp }, // Ensure format matches backend schema
      }),
    });

    if (!backendChatResponse.ok) {
      const errorBody = await backendChatResponse.text();
      console.error('Backend chat save failed:', backendChatResponse.status, errorBody);
      return NextResponse.json({ error: `Backend Chat Save Error: ${backendChatResponse.status} ${errorBody}` }, { status: backendChatResponse.status });
    }
    const savedChat = await backendChatResponse.json();
    // 2. Call Gemini API for response

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }

    const prompt = `
      You are a friendly and helpful AI Health Assistant. 
      Your role is to provide safe, general health information and encouragement.
      Do not provide medical diagnoses or prescribe treatments. 
      If asked for a diagnosis or prescription, you must politely decline and advise the user to consult a healthcare professional.
      
      Current Conversation:
      ${(history || []).map((msg: { sender: string; text: string }) => `${msg.sender}: ${msg.text}`).join('\n')}
      user: ${message.text}
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

    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      return NextResponse.json({ error: `Gemini API Error: ${geminiResponse.status} ${errorBody}` }, { status: geminiResponse.status });
    }

    const responseData = await geminiResponse.json();
    const textOutput = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (textOutput) {
      // Optionally, send AI response back to backend to save it too
      await fetch(`${BACKEND_API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: mongoUserId,
          chatId: chatId,
          title: savedChat.title, // Use the title from the saved chat object
          message: { role: 'ai', content: textOutput, timestamp: Date.now() },
        }),
      });
      return NextResponse.json({ reply: textOutput, title: savedChat.title, _id: savedChat._id, updatedAt: savedChat.updatedAt });
    } else {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 500 });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error processing chat request:', error);
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const chatId = url.pathname.split('/').pop(); // Extract chatId from path
  const firebaseUID = request.headers.get('X-Firebase-UID');

  if (!chatId || !firebaseUID) {
    return NextResponse.json({ error: 'Missing chat ID or Firebase UID for deletion.' }, { status: 400 });
  }

  try {
    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);

    // Call backend to delete the chat
    const response = await fetch(`${BACKEND_API_BASE_URL}/chat/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Optionally, pass userId for authorization in backend if needed
        // 'X-User-ID': mongoUserId,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to delete chat from backend: ${response.status} ${errorBody}`);
    }

    return NextResponse.json({ message: 'Chat deleted successfully.' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Failed to delete chat.', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 