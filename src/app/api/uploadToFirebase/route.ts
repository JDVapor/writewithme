import { db } from "@/lib/db";
import { $works } from "@/lib/db/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { workId } = await req.json();
    // extract out the dalle imageurl
    // save it to firebase
    const works = await db
      .select()
      .from($works)
      .where(eq($works.id, parseInt(workId)));
    if (!works[0].imageUrl) {
      return new NextResponse("no image url", { status: 400 });
    }
    const firebase_url = await uploadFileToFirebase(
      works[0].imageUrl,
      works[0].name
    );
    // update the work with the firebase url
    await db
      .update($works)
      .set({
        imageUrl: firebase_url,
      })
      .where(eq($works.id, parseInt(workId)));
    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("error", { status: 500 });
  }
}
