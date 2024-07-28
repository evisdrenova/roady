import { ReactElement } from "react";
import { Button } from "./ui/button";
import UserAvatar from "./ui/UserAvatar";
import { signIn, signOut } from "next-auth/react";

export default function GoogleOAuth() {
  const launchGoogleOAuth = async () => {
    await signIn("google");
  };

  const signOutButton = async () => {
    await signOut();
  };

  return (
    <>
      <Button onClick={() => launchGoogleOAuth()}>Login with Google</Button>
      <Button onClick={() => signOutButton()}>Logout</Button>
    </>
  );
}
