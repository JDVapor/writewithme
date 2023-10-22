import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { $works } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    workId: string;
  };
};

const NotebookPage = async ({ params: { workId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/dashboard");
  }
  const works = await db
    .select()
    .from($works)
    .where(and(eq($works.id, parseInt(workId)), eq($works.userId, userId)));
  if (works.length != 1) {
    return redirect("/dashboard");
  }
  const work = works[0];
  return (
    <div className="min-h-screen grainy p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
          <Link href="/dashboard">
            <Button className="bg-cyan-600" size="sm">
              Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;
