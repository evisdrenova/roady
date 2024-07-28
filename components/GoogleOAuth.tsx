import { ReactElement } from "react";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RxAvatar } from "react-icons/rx";

export default function GoogleOAuth(): ReactElement {
  const session = useSession();
  const launchGoogleOAuth = async () => {
    await signIn("google");
  };

  const signOutButton = async () => {
    await signOut();
  };

  console.log("sess", session.data?.user);
  return (
    <>
      {session.status == "authenticated" ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-6 h-6">
              <AvatarImage src={session.data.user?.image ?? ""} />
              <AvatarFallback>
                {session?.data.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => signOutButton()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={launchGoogleOAuth}
          variant="ghost"
          className="rounded"
          size="sm"
        >
          <RxAvatar className="w-6 h-6" />
        </Button>
      )}
    </>
  );
}
