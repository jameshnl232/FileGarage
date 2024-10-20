"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "date-fns";
import FileCardActions from "./FileCardActions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: userId,
  });
  return (
    <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  );
}

export const columns: ColumnDef<{
  url?: string | null | undefined;
  isFavorited?: boolean;
  _id: Id<"files">;
  _creationTime: number;
  organizationId?: string | undefined;
  name: string;
  fileId: Id<"_storage">;
  type: "image" | "csv" | "pdf";
  userId: Id<"users">;
}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "User",
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },

  {
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const formattedDate = formatRelative(
        new Date(row.original._creationTime),
        new Date()
      );
      return <div>{formattedDate}</div>;
    }
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return <FileCardActions file={row.original} />;
    },
  },
];
