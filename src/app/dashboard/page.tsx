import CreateWorkDialog from "@/components/CreateWorkDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { $works } from "@/lib/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const DashboardPage = async (props: Props) => {
  const { userId } = auth();
  const works = await db
    .select()
    .from($works)
    .where(eq($works.userId, userId!));

  return (
    <>
      <div className="grainy min-h-screen">
        <div className="max-w-7xl mx-auto p-10">
          <div className="h-14"></div>
          <div className="flex justify-between items-center md:flex-row flex-col">
            <div className="flex items-center">
              <Link href="/">
                <Button className="bg-green-600" size="sm">
                  <ArrowLeft className="mr-1 w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="w-4"></div>
              <h1 className="text-3xl font-bold text-gray-900">My Works</h1>
              <div className="w-4"></div>
              <UserButton />
            </div>
          </div>

          <div className="h-8"></div>
          <Separator />
          <div className="h-8"></div>
          {works.length === 0 && (
            <div className="text-center">
              <h2 className="text-xl text-gray-500">You have no works yet.</h2>
            </div>
          )}

          <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3 auto-rows-[min-content]">
            <CreateWorkDialog />
            {works.map((work) => {
              return (
                <a
                  href={`/workbook/${work.id}`}
                  key={work.id}
                  className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1"
                >
                  <div className="flex flex-col h-full">
                    <Image
                      width={400}
                      height={200}
                      alt={work.name}
                      src={work.imageUrl || ""}
                    />
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {work.name}
                      </h3>
                      <div className="flex-grow"></div>
                      <p className="text-sm text-gray-500">
                        {new Date(work.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
