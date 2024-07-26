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

const CreateWorkDialog = (props: Props) => {
  const router = useRouter();
  const [input, setInput] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const uploadToFirebase = useMutation({
    mutationFn: async (workId: string) => {
      const response = await axios.post("/api/uploadToFirebase", {
        workId,
      });
      return response.data;
    },
  });
  const createWorkbook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createWorkBook", {
        name: input,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      setErrorMessage("Please enter a title for your new workbook.");
      return;
    }
    if (input.length > 40) {
      setErrorMessage("Title cannot exceed 40 characters.");
      return;
    }
    setErrorMessage(""); // Clear error message on valid input
    createWorkbook.mutate(undefined, {
      onSuccess: ({ work_id }) => {
        console.log("created new work:", { work_id });
        // hit another endpoint to uplod the temp dalle url to permanent firebase url
        uploadToFirebase.mutate(work_id);
        router.push(`/workbook/${work_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to create new workbook.");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold text-green-600 sm:mt-2">
            New Work Book
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Work Book</DialogTitle>
          <DialogDescription>
            You can create a new workbook by clicking below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Title..."
          />
          {errorMessage && (
            <div className="text-red-600 mt-2">{errorMessage}</div>
          )}
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              className="bg-green-600"
              disabled={createWorkbook.isLoading}
            >
              {createWorkbook.isLoading && (
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

export default CreateWorkDialog;
