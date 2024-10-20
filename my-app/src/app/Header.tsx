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

export default function Header() {
  const user = useUser();

  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="container mx-auto  justify-between items-center flex px-10">
        <Link href="/" className="text-2xl font-bold">
          FileGarage
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
