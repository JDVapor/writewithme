"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {};

const CreateWork = (props: Props) => {
  const router = useRouter();
  const [input, setInput] = React.useState("");
  const createWork = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createWork", {
        name: input,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      window.alert("Please enter a title for your new work.");
      return;
    }
    createWork.mutate(undefined, {
      onSuccess: ({ work_id }) => {
        console.log("Created new work:", { work_id });
        router.push(`notebook/${work_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to create new work");
      },
    });
  };
  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-cyan-600" strokeWidth={3} />
          <h2 className="font-semibold text-cyan-600 sm:mt-2">New Work</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Work</DialogTitle>
          <DialogDescription>
            You can create a new work by clicking below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name..."
          />
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              className="bg-cyan-600"
              disabled={createWork.isLoading}
            >
              {createWork.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWork;
