import { ReactElement } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RxAvatar } from "react-icons/rx";

export default function UserProfile(): ReactElement {
  const session = useSession();

  const signOutButton = async () => {
    await signOut();
  };
  return (
    <>
      {session.status == "authenticated" && (
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded hover:bg-gray-100 px-3">
            <RxAvatar />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => signOutButton()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
