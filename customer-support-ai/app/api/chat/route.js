import Groq from "groq-sdk";
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = 'you are a helpful assistant.';

export async function POST(req) {
  try {
    // Default user message if none is provided
    const defaultMessage = {
      role: 'user',
      content: 'Explain the importance of rulyOTB in pop culture'
    };

    // Parse JSON body or use default message if body is missing
    const data = await req.json().catch(() => ({ messages: [defaultMessage] }));
    const userMessages = data.messages?.filter(message => message.role === 'user') || [defaultMessage];

    if (userMessages.length === 0) {
      return NextResponse.json({ message: 'Invalid request format. Expected user messages.' }, { status: 400 });
    }

    // Create the chat completion with Groq
    const chatCompletion = await groq.chat.completions.create({ 
      messages: [
        { role: 'system', content: systemPrompt },
        ...userMessages,
      ],
      model: 'llama3-8b-8192',
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });

    return NextResponse.json(chatCompletion);

  } catch (error) {
    console.error('Error creating completion:', error);
    return NextResponse.json({ message: 'Error creating completion', error: error.message }, { status: 500 });
  }
}
