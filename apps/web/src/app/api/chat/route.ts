import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001/api';

async function getOrCreateMongoUserId(firebaseUID: string): Promise<string> {
    if (!firebaseUID) {
      throw new Error('Firebase UID is required.');
    }
    
    try {
      const userResponse = await fetch(`${BACKEND_API_BASE_URL}/users/firebase/${firebaseUID}`);
      
      if (userResponse.status === 404) {
        const newUserResponse = await fetch(`${BACKEND_API_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            firebaseUID, 
            name: 'New User',
            email: `${firebaseUID}@example.com`
          }),
        });
  
        if (!newUserResponse.ok) {
          const errorBody = await newUserResponse.text();
          throw new Error(`Failed to create user in backend: ${newUserResponse.status} ${errorBody}`);
        }
        
        const newUserData = await newUserResponse.json();
        return newUserData._id;
  
      } else if (userResponse.ok) {
        const userData = await userResponse.json();
        return userData._id;
      } else {
        const errorBody = await userResponse.text();
        throw new Error(`Failed to fetch user from backend: ${userResponse.status} ${errorBody}`);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error('Error ensuring user in backend:', errorMessage);
      throw new Error(`Backend user synchronization failed: ${errorMessage}`);
    }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const firebaseUID = searchParams.get('userId');

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch chat history.', details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId: firebaseUID, chatId, title, message, history } = await request.json();

    if (!firebaseUID || !chatId || !message) {
      return NextResponse.json({ error: 'Missing required chat data (userId, chatId, message).'}, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured.');
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }

    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);
    const isNewChat = !!title;

    // First, save the user's message.
    const userMessageResponse = await fetch(`${BACKEND_API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: mongoUserId,
            chatId: chatId,
            title: title, // This will create the chat with a temporary title if new
            message: message,
        }),
    });

    if (!userMessageResponse.ok) {
      const errorBody = await userMessageResponse.text();
      return NextResponse.json({ error: 'Failed to save user message to backend.', details: errorBody }, { status: 500 });
    }

    // Then, get the AI response.
    const geminiRequestBody = buildGeminiRequest(isNewChat, message.content, history);
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiRequestBody),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      return NextResponse.json({ error: `Gemini API Error: ${geminiResponse.status} ${errorBody}` }, { status: geminiResponse.status });
    }
    
    const responseData = await geminiResponse.json();
    const rawTextOutput = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawTextOutput) {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 500 });
    }
    
    let { finalTitle, aiReply } = parseGeminiResponse(isNewChat, rawTextOutput, title);
    
    // Finally, save the AI's message and update the title if it's a new chat.
    const aiMessageResponse = await fetch(`${BACKEND_API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: mongoUserId,
            chatId: chatId,
            title: finalTitle, // This will update the title on the existing document
            message: { role: 'ai', content: aiReply, timestamp: Date.now() },
        }),
    });

    if (!aiMessageResponse.ok) {
        const errorBody = await aiMessageResponse.text();
        console.error("Failed to persist AI message:", errorBody);
        return NextResponse.json({ error: 'Failed to save AI response.', details: errorBody }, { status: 500 });
    }
    
    const finalChatState = await aiMessageResponse.json();
    
    return NextResponse.json({ 
        reply: aiReply, 
        title: finalChatState.title, 
        _id: finalChatState._id, 
        updatedAt: finalChatState.updatedAt 
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error processing chat request:', error);
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const chatId = url.pathname.split('/').pop();
  const firebaseUID = request.headers.get('X-Firebase-UID');

  if (!chatId || !firebaseUID) {
    return NextResponse.json({ error: 'Missing chat ID or Firebase UID for deletion.' }, { status: 400 });
  }

  try {
    await getOrCreateMongoUserId(firebaseUID);

    const response = await fetch(`${BACKEND_API_BASE_URL}/chat/${chatId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to delete chat from backend: ${response.status} ${errorBody}`);
    }

    return NextResponse.json({ message: 'Chat deleted successfully.' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to delete chat.', details: errorMessage }, { status: 500 });
  }
}

function buildGeminiRequest(isNewChat: boolean, userText: string, history: any[]) {
  let prompt;
  if (isNewChat) {
    prompt = `
      Based on the following user query, your first task is to create a short, concise, and relevant title for the chat (4-5 words maximum).
      The title MUST be on the very first line, and it should not be in quotes or markdown.
      Then, on a new line, add "---" as a separator.
      Finally, on the subsequent lines, provide your helpful and friendly response to the user's query as an AI Health Assistant.

      User Query: "${userText}"
    `;
  } else {
    prompt = `
      You are a friendly and helpful AI Health Assistant. 
      Your role is to provide safe, general health information and encouragement.
      Do not provide medical diagnoses or prescribe treatments. 
      If asked for a diagnosis or prescription, you must politely decline and advise the user to consult a healthcare professional.
      
      Current Conversation History (for context):
      ${(history || []).map((msg: { sender: string; text: string }) => `${msg.sender}: ${msg.text}`).join('\n')}
      
      New User Message:
      user: ${userText}
      ai:
    `;
  }

  return {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
      maxOutputTokens: 8192,
      },
       safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };
}

function parseGeminiResponse(isNewChat: boolean, rawText: string, defaultTitle: string) {
  let aiReply = rawText;
  let finalTitle = defaultTitle;

  if (isNewChat) {
    const parts = rawText.split('\n---\n');
    if (parts.length > 1) {
      finalTitle = parts[0].trim().replace(/^"|"$/g, '');
      aiReply = parts.slice(1).join('\n---\n').trim();
    }
  }
  return { finalTitle, aiReply };
} 