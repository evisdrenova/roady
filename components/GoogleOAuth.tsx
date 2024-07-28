"use client";
import { ReactElement } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function GoogleOAuth(): ReactElement {
  const router = useRouter();
  const launchGoogleOAuth = () => {
    router.push("/api/auth/google");
    router.refresh;
  };
  return <Button onClick={launchGoogleOAuth}>Login with Google</Button>;
}
