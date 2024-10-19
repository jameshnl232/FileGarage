"use client";

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import FileDialog from "./FileDialog";

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
      <div className="container mx-auto pt-12 ">
        <div className="flex justify-between  items-center">
          <h1 className="text-4xl font-bold">File Garage</h1>

          <FileDialog />
        </div>
        {getFiles?.map((file) => <div key={file._id}>{file.name}</div>)}
      </div>
    </>
  );
}
