"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import FileDialog from "./FileDialog";
import FileCard from "./FileCard";
import SearchBar from "./Search-bar";
import { GridIcon, Loader2, TableIcon } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Image from "next/image";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { Label } from "@/components/ui/label";


export default function FileBrowser({
  title,
  favoriteOnly,
  deletedOnly,
}: {
  title: string;
  favoriteOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();

  let organizationId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    organizationId = organization.organization?.id ?? user.user?.id;
  }

  const [query, setQuery] = useState("");

  const [selectedView, setSelectedView] = useState<
    "image" | "csv" | "pdf" | "all"
  >("all");

  const getFiles = useQuery(
    api.file.getFiles,
    organizationId
      ? {
          organizationId,
          query,
          favorite: favoriteOnly,
          deletedOnly: deletedOnly,
          type: selectedView,
        }
      : "skip"
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
        <div className="w-full">
          <>
            <div className="flex justify-between items-center mx-10 mb-10 gap-2 flex-wrap">
              <h1 className="text-4xl hover:no-underline font-bold">{title}</h1>
              <SearchBar
                orgId={organizationId ?? ""}
                setQuery={setQuery}
                query={query}
              />
              {!favoriteOnly && <FileDialog />}
            </div>

            <Tabs defaultValue="grid" className="w-full">
              <div className="flex justify-between w-full mx-10 ">
                <TabsList className="mb-10">
                  <TabsTrigger value="grid" className="flex items-center gap-2">
                    <GridIcon />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value="table"
                    className="flex items-center gap-2"
                  >
                    <TableIcon />
                    Table
                  </TabsTrigger>
                </TabsList>
                <div className="flex justify-end items-center gap-2">
                  <Label htmlFor="type">Type Filter</Label>
                  <Select
                    value={selectedView}
                    onValueChange={(value: any) => setSelectedView(value)}
                  >
                    <SelectTrigger
                      id="type"
                      className="w-[180px]"
                      defaultValue="All"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="pdf">PDFs</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {isLoading && (
                <div className="flex flex-col justify-center items-center w-full h-screen gap-4 ">
                  <Loader2 className="animate-spin w-32 h-32 text-gray-500" />
                  <div className="text-2xl font-bold">
                    Loading your files...
                  </div>
                </div>
              )}
              <TabsContent value="grid">
                {modifiedFiles.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 mx-10 ">
                    {modifiedFiles?.map((file) => (
                      <FileCard key={file._id} file={file} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 justify-start mt-10 w-full ">
                    <h2 className="text-4xl font-semibold mb-4 mx-10">
                      Search Results
                    </h2>
                    <h2 className="text-2xl font-bold">No files found</h2>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="table">
                {modifiedFiles.length > 0 ? (
                  <div className="container mx-auto py-10">
                    <DataTable columns={columns} data={modifiedFiles} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 justify-start mt-10 w-full ">
                    <h2 className="text-4xl font-semibold mb-4 mx-10">
                      Search Results
                    </h2>
                    <h2 className="text-2xl font-bold">No files found</h2>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>

          {!isLoading && getFiles.length === 0 && !query && !favoriteOnly && (
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
      </main>
    </>
  );
}
