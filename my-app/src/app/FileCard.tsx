import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  TrashIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode, useState } from "react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

//exuberant-penguin-209.convex.cloud/api/storage/5e85106f-468f-49b1-af57-76252350c43e
const getImageUrl = (fileId: Id<"_storage">) => {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
};

const FileCardActions = ({ file }: { file: Doc<"files"> }) => {
  const [open, setOpen] = useState(false);
  const deleteFile = useMutation(api.file.deleteFile);


  const { toast } = useToast();
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are
              deleted periodically
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (file.organizationId) {
                  await deleteFile({
                    fileId: file.fileId,
                  });
                  toast({
                    variant: "default",
                    title: "Success",
                    description: "File deleted successfully",
                  });
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="text-red-500 flex items-center justify-center cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="text-red-500 " />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default function FileCard({
  file,
}: {
  file: {
    url?: string | null | undefined;
    _id: Id<"files">;
    _creationTime: number;
    organizationId?: string | undefined;
    name: string;
    fileId: Id<"_storage">;
    type: "image" | "csv" | "pdf";
  };
}) {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  console.log(file.url);

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
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
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            window.open(file.url ? file.url : "", "_blank");
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
