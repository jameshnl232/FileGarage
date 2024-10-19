"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import FileDialog from "./FileDialog";
import Image from "next/image";
import FileCard from "./FileCard";
import { Loader2 } from "lucide-react";

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

  const isLoading = getFiles === undefined;

  return (
    <>
      <main className="container mx-auto pt-12 ">
        {isLoading && (
          <div className="flex flex-col justify-center items-center w-full h-screen gap-4">
            <Loader2 className="animate-spin w-32 h-32 text-gray-500" />
            <div className="text-2xl font-bold">Loading your files...</div>
          </div>
        )}

        {!isLoading && getFiles.length > 0 && (
          <>
            <div className="flex justify-between mb-12  items-center mx-10">
              <h1 className="text-4xl  font-bold">File Garage</h1>

              <FileDialog />
            </div>

            <div className="grid grid-cols-3 gap-4 mx-10">
              {getFiles?.map((file) => <FileCard key={file._id} file={file} />)}
            </div>
          </>
        )}

        {!isLoading && getFiles.length === 0 && (
          <div className="flex flex-col items-center gap-4 justify-center w-full h-full">
            <Image
              alt="empty file image"
              src="/empty.svg"
              width={300}
              height={300}
            />
            <p className="text-sm text-gray-500">
              No files found. Upload your first file
            </p>
            <FileDialog />
          </div>
        )}
      </main>
    </>
  );
}
