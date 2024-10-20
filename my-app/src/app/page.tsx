"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import FileDialog from "./dashboard/_components/FileDialog";
import Image from "next/image";
import FileCard from "./dashboard/_components/FileCard";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import SearchBar from "./dashboard/_components/Search-bar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let organizationId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    organizationId = organization.organization?.id ?? user.user?.id;
  }

  const [query, setQuery] = useState("");
  const getFiles = useQuery(
    api.file.getFiles,
    organizationId ? { organizationId, query } : "skip"
  );

  const isLoading = getFiles === undefined;

  return (
    <>
      <h1>hello, world</h1>
    </>
  );
}
