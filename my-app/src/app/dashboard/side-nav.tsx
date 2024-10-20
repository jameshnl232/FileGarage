"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();
  return (
    <div className="w-40 border-r sm:h-screen h-full">
      <Link href="/dashboard/files">
        <Button
          variant="link"
          className={clsx("gap-2 flex items-center justify-start", {
            "text-blue-500": pathname.includes("/dashboard/files"),
          })}
        >
          <FileIcon />
          <span className="text-xl">All files</span>
        </Button>
      </Link>

      <Link href="/dashboard/favorites">
        <Button
          variant="link"
          className={clsx("gap-2 flex items-center justify-start", {
            "text-blue-500": pathname.includes("/dashboard/favorites"),
          })}
        >
          <StarIcon />
          <span className="text-xl">Favorites</span>
        </Button>
      </Link>

      <Link href="/dashboard/trash">
        <Button
          variant="link"
          className={clsx("gap-2 flex items-center justify-start", {
            "text-blue-500": pathname.includes("/dashboard/trash"),
          })}
        >
          <TrashIcon />
          <span className="text-xl">Trash</span>
        </Button>
      </Link>
    </div>
  );
}
