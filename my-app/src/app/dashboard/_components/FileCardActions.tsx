import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useToast } from "@/hooks/use-toast";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { DownloadIcon, MoreVertical, StarIcon, TrashIcon, UndoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Protect, useUser } from "@clerk/nextjs";

const FileCardActions = ({
  file,
}: {
  file: {
    url?: string | null | undefined;
    isFavorited?: boolean;
    shouldDelete?: boolean;
    _id: Id<"files">;
    _creationTime: number;
    organizationId?: string | undefined;
    name: string;
    fileId: Id<"_storage">;
    type: "image" | "csv" | "pdf";
    userId: Id<"users">;
  };
}) => {
  const [open, setOpen] = useState(false);
  const deleteFile = useMutation(api.file.deleteFile);
  const toggleFavorite = useMutation(api.file.toggleFavorite);
  const restoreFile = useMutation(api.file.restoreFile);
  const me = useQuery(api.users.getMe);
 

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
                    fileId: file._id,
                  });
                  toast({
                    variant: "default",
                    title: "Success",
                    description: "File will be deleted soon",
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
          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
            fallback={<></>}
          >
            <DropdownMenuItem
              className="text-red-500 flex items-center justify-center cursor-pointer"
              onClick={() => {
                if (file.shouldDelete) {
                  restoreFile({ fileId: file._id });
                } else {
                  setOpen(true);
                }
              }}
            >
              {file.shouldDelete ? (
                <div className="flex items-center gap-1">
                  <UndoIcon className="text-green-500 w-4 h-4" />
                  Restore
                </div>
              ) : (
                <div className=" flex items-center gap-1">
                  <TrashIcon className="text-red-500 " />
                  Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-gray-500 flex items-center justify-center cursor-pointer"
            onClick={() => toggleFavorite({ fileId: file._id })}
          >
            {file.isFavorited ? (
              <StarIcon className="text-yellow-500 " />
            ) : (
              <StarIcon className="text-gray-500 " />
            )}
            {file.isFavorited ? "Remove from favorites" : "Add to favorites"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              onClick={() => {
                window.open(file.url ? file.url : "", "_blank");
              }}
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Download
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FileCardActions;
