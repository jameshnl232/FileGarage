"use client";

import { Button } from "@/components/ui/button";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  SignOutButton,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const getFiles = useQuery(api.file.getFiles);
  const createFile = useMutation(api.file.createFile);

  return (
    <div className="flex flex-col  justify-center items-center min-h-screen">
      <Button onClick={() => createFile({ name: "test", content: "test" })}>
        Create File
      </Button>

      {getFiles?.map((file) => <div key={file._id}>{file.name}</div>)}

      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </SignedIn>
    </div>
  );
}
