import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TypewriterTitle from "@/components/ui/TypewriterTitle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-gradient-to-r min-h-screen grainy from-gray-100 to-green-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="font-semibold text-7xl text-center">
          AI <span className="text-cyan-600 font-bold">Writers</span> Assistant.
        </h1>
        <div className="mt-4">
          <h2 className="font-semibold text-3xl text-center text-slate-700">
            <TypewriterTitle />
          </h2>
          <div className="mt-8"></div>
          <div className="flex justify-center">
            <Link href="/dashboard">
              <Button className="bg-cyan-600">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
