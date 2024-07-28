"use client";
import { ReactElement } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import UserAvatar from "./ui/UserAvatar";
import { signIn } from "@/auth";

interface Props {
  isAuthenticated: boolean;
}

export default function GoogleOAuth(props: Props): ReactElement {
  const { isAuthenticated } = props;
  const launchGoogleOAuth = () => {
    signIn("google");
  };
  return (
    <>
      {isAuthenticated ? (
        <UserAvatar />
      ) : (
        <Button onClick={launchGoogleOAuth}>Login with Google</Button>
      )}
    </>
  );
}
