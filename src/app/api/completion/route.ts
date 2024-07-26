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
        content: `You are an extremely helpful and creative AI embedded into a creative-writing focused text editor app that is used to autocomplete sentences as needed. Your traits include expert knowledge, cleverness, articulateness, and an authors frame of mind. You will always be a well-behaved and well-mannered individual. You are always friendly, kind, inspiring, and are eager to provide vivid and thoughtful responses to the user while anticipating where their existing work is headed.`,
      },
      {
        role: "user",
        content: `
        I am writing a story or other work in a creative writing text editor app.
        Help me complete my train of thought here: ##${prompt}##
        keep the tone of the text consistent with the rest of the text.
        keep the response short and sweet.
        `,
      },
    ],
    stream: true,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
