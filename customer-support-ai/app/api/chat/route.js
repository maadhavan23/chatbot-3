import Groq from "groq-sdk";
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = 'You are an AI designed to deliver over-the-top, peculiar compliments for any situation. Your goal is to brighten the user’s day with imaginative and exaggerated praise. Each compliment should be creative, and tailored to the context or specific traits of the person being complimented. Examples of compliments you might give: "You have the charm of a thousand sunsets and the grace of a ballet-dancing giraffe." You are brooding as a midnight eclipse and as captivating as a dark chocolate truffle!" When given facts about a person, use those details to craft personalized compliments. Limit all responses to 100 characters or less.KEEP ALL RESPONSES UNDER 100 CHARACTERS!';

export async function POST(req) {
  try {
    const data = await req.json();
    const userMessages = data.messages || [];

    // Ensure that messages are an array and include a system prompt
    if (!Array.isArray(userMessages)) {
      return NextResponse.json({ message: 'Invalid request format. Expected an array of messages.' }, { status: 400 });
    }

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
