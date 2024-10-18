import { OrganizationSwitcher, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="container mx-auto  justify-between items-center flex px-10">
        <h1 className="text-2xl font-bold">FileGarage</h1>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
