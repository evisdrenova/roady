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
    <div>
      {session.status == "authenticated" && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <RxAvatar className="w-6 h-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => signOutButton()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
