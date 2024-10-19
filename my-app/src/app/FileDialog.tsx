import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileForm from "./FileForm";
import { useState } from "react";


export default function FileDialog() {

    const [open, setOpen] = useState(false);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Upload a new file
          </DialogTitle>
          <DialogDescription>
            This file will be accessible by anyone in your organization
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <FileForm open={open} setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
