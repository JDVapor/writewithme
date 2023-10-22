import { db } from "@/lib/db";
import { $works } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Need to login first", { status: 401 });
  }
  const body = await req.json();
  const { name } = body;
  const image_description = await generateImagePrompt(name);
  if (!image_description) {
    return new NextResponse("failed to generate image description", {
      status: 500,
    });
  }
  const image_url = await generateImage(image_description);
  if (!image_url) {
    return new NextResponse("failed to generate image", { status: 500 });
  }

  const work_ids = await db
    .insert($works)
    .values({
      name,
      userId,
      imageUrl: image_url,
    })
    .returning({
      insertedId: $works.id,
    });
  return NextResponse.json({
    work_id: work_ids[0].insertedId,
  });
}
