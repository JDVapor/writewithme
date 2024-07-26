import { db } from "@/lib/db";
import { $works } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { workId } = await req.json();
  await db.delete($works).where(eq($works.id, parseInt(workId)));
  return new NextResponse("ok", { status: 200 });
}
