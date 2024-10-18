"use client";

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "./Header";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let organizationId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    organizationId = organization.organization?.id ?? user.user?.id;
  }

  const getFiles = useQuery(
    api.file.getFiles,
    organizationId ? { organizationId } : "skip"
  );
  const createFile = useMutation(api.file.createFile);

  return (
    <>
      <Header />
      <div className="flex flex-col  justify-center items-center min-h-screen">
        <Button
          onClick={() => {
            if (!organizationId) {
              return;
            }
            createFile({
              name: "test",
              content: "test",
              organizationId,
            });
          }}
        >
          Create File
        </Button>

        {getFiles?.map((file) => <div key={file._id}>{file.name}</div>)}
      </div>
    </>
  );
}
