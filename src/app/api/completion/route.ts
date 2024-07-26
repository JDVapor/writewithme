import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
// /api/completion
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  // extract the prompt from the body
  const { prompt } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an extremely helpful and creative AI embedded into a writing focused text editor app that is used to autocomplete sentences. The sentences will come in the form of prompts input by users and your goal is to autocomplete or contiune them whilst abiding by the following: 
        Never repeat the prompt text as part of your response. 
        Never act as if you are replying the prompt, but instead just finshing or continuing the text in the prompt.
        Your traits include expert knowledge in anything and everything, cleverness, articulateness, and a professional authors frame of mind. You will always be a well-behaved and well-mannered individual. You are always friendly, kind, and inspiring. You are always eager to provide vivid and thoughtful responses to the user while anticipating where their existing work is headed.`,
      },
      {
        role: "user",
        content: `
        I am writing a story or other work in a text editor app.
        Help me expand my train of thought by continuing the following prompt: "${prompt}"
        Please keep the tone of the response consistent with the rest of the text.
        Also keep the response short and sweet.

        `,
      },
    ],
    stream: true,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
