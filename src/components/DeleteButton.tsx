"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  workId: number;
};

const DeleteButton = ({ workId }: Props) => {
  const router = useRouter();
  const deleteWork = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deleteWork", {
        workId,
      });
      return response.data;
    },
  });
  return (
    <Button
      variant={"destructive"}
      size="sm"
      disabled={deleteWork.isLoading}
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to delete this work?"
        );
        if (!confirm) return;
        deleteWork.mutate(undefined, {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (err) => {
            console.error(err);
          },
        });
      }}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
