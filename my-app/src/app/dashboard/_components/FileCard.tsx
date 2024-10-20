import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";

import { ReactNode, useState } from "react";

import Image from "next/image";
import FileCardActions from "./FileCardActions";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "date-fns";


export default function FileCard({
  file,
}: {
  file: {
    url?: string | null | undefined;
    isFavorited?: boolean;
    _id: Id<"files">;
    _creationTime: number;
    organizationId?: string | undefined;
    name: string;
    fileId: Id<"_storage">;
    type: "image" | "csv" | "pdf";
    userId: Id<"users">;
  };
}) {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

   const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

    const formattedDate = formatRelative(
      new Date(file._creationTime),
      new Date()
    );


  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-base font-normal">
          {typeIcons[file.type]}
          {file.name}
        </CardTitle>
        <div className="absolute top-1 right-1">
          <FileCardActions file={file} />
        </div>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-[400px]">
        {file.type === "image" && (
          <Image
            src={file.url ? file.url : ""}
            alt={file.name}
            width={200}
            height={200}
          />
        )}
        {file.type === "pdf" && (
          <FileTextIcon className="text-sky-500 w-20 h-20" />
        )}
        {file.type === "csv" && (
          <GanttChartIcon className="text-sky-500 w-20 h-20" />
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 ">
        <div className="flex justify-between w-full">

          <div className="flex items-center gap-2 justify-start w-full">
            <div className="text-sm">{userProfile?.name}</div>

            <Avatar className="w-6 h-6">
              <AvatarImage src={userProfile?.image} />
              <AvatarFallback>
                {userProfile?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-sm text-gray-500">{formattedDate}</div>
        </div>

        
      </CardFooter>
    </Card>
  );
}
