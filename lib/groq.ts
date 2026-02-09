//lib/groq.ts
import Groq from 'groq-sdk';
import type {
  ChatCompletionMessageParam,
} from 'groq-sdk/resources/chat/completions';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function chatWithGroq(
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
) {
  const systemPrompt = `You are a helpful museum ticketing assistant. Help visitors book tickets for:
  
Ticket Types:
- General Admission (Adult): ₹200
- General Admission (Child): ₹100
- Student (with ID): ₹150
- Senior Citizen: ₹100
- VIP Tour: ₹500
- Group (10+ people): ₹150 per person

Museum Timings: 9 AM - 6 PM (Closed on Mondays)

Special Exhibitions:
- Ancient Artifacts Exhibition: +₹50
- Modern Art Gallery: +₹30

You should:
1. Answer questions about tickets, prices, and museum information
2. Be friendly and helpful
3. When users want to book, tell them to click the "Book Tickets" button

DO NOT pretend to process bookings yourself.
Always be friendly and professional.`;

  // ✅ EXPLICITLY TYPE MESSAGES
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...conversationHistory.map(
      (msg): ChatCompletionMessageParam => ({
        role: msg.role, // now strictly 'user' | 'assistant'
        content: msg.content,
      })
    ),
    {
      role: 'user',
      content: userMessage,
    },
  ];

  const chatCompletion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return (
    chatCompletion.choices[0]?.message?.content ??
    'Sorry, I could not process that.'
  );
}
