"use client";

import {
  OrganizationSwitcher,
  UserButton,
  SignedOut,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const user = useUser();

  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="container mx-auto  justify-between items-center flex px-10">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <Image src="/logo.jpg" alt="FileGarage" width={50} height={50} className="rounded-full" />
          FileGarage
        </Link>

        <Link href="/dashboard/files">
          <Button variant="outline">Your Files</Button>
        </Link>

        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          {!user.isSignedIn && (
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}
