import { ReactElement } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";

interface Props {
  setOpenOAuth: (val: boolean | ((prev: boolean) => boolean)) => void;
  openOAuth: boolean;
}

export default function GoogleOAuth(props: Props): ReactElement {
  const { setOpenOAuth, openOAuth } = props;

  return (
    <Dialog onOpenChange={() => setOpenOAuth((prev) => !prev)} open={openOAuth}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify your email to continue</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <LoginWithGoogleButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LoginWithGoogleButton(): ReactElement {
  const launchGoogleOAuth = async () => {
    await signIn("google");
  };
  return (
    <div>
      <Button
        onClick={launchGoogleOAuth}
        className="rounded space-x-2"
        size="sm"
      >
        <FcGoogle />
        <div>Login with Google</div>
      </Button>
    </div>
  );
}
