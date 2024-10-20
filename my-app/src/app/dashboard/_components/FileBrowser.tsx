"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import FileDialog from "./FileDialog";
import FileCard from "./FileCard";
import SearchBar from "./Search-bar";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import Image from "next/image";
export default function FileBrowser({
  title,
  favoriteOnly,
}: {
  title: string;
  favoriteOnly: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();

  let organizationId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    organizationId = organization.organization?.id ?? user.user?.id;
  }

  const [query, setQuery] = useState("");

  const getFiles = useQuery(
    api.file.getFiles,
    organizationId ? { organizationId, query, favorite: favoriteOnly } : "skip"
  );

  const isLoading = getFiles === undefined;

  const favorites = useQuery(
    api.file.getAllFavorites,
    organizationId ? { organizationId } : "skip"
  );

  const modifiedFiles =
    getFiles?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];
  return (
    <>
      <main className="container mx-auto  ">
        <div className="flex gap-8">
          <div className="w-full">
            {isLoading && (
              <div className="flex flex-col justify-center items-center w-full h-screen gap-4">
                <Loader2 className="animate-spin w-32 h-32 text-gray-500" />
                <div className="text-2xl font-bold">Loading your files...</div>
              </div>
            )}

            {!isLoading && (
              <>
                <div className="flex justify-between mb-12  items-center mx-10">
                  <h1 className="text-4xl hover:no-underline font-bold">
                    {title}
                  </h1>
                  <SearchBar
                    orgId={organizationId ?? ""}
                    setQuery={setQuery}
                    query={query}
                  />
                  <FileDialog />
                </div>

                {modifiedFiles.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 mx-10">
                    {modifiedFiles?.map((file) => (
                      <FileCard key={file._id} file={file} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 justify-center w-full h-full">
                    <h2 className="text-4xl font-semibold mb-4 mx-10">
                      Search Results
                    </h2>
                    <h2 className="text-2xl font-bold">No files found</h2>
                  </div>
                )}
              </>
            )}

            {!isLoading && getFiles.length === 0 && !query && (
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
          </div>
        </div>
      </main>
    </>
  );
}
