import { db } from "@/lib/db";
import { $works } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { workId, editorState } = body;
    if (!editorState || !workId) {
      return new NextResponse("Missing editorState or workId", { status: 400 });
    }

    workId = parseInt(workId);
    const works = await db.select().from($works).where(eq($works.id, workId));
    if (works.length != 1) {
      return new NextResponse("failed to update", { status: 500 });
    }

    const work = works[0];
    if (work.editorState !== editorState) {
      await db
        .update($works)
        .set({
          editorState,
        })
        .where(eq($works.id, workId));
    }
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}
