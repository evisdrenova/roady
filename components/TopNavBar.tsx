import { ReactElement } from "react";
import { ModeToggle } from "./ModeToggle";
import GoogleOAuth from "./GoogleOAuth";
import UserProfile from "./UserProfile";
import Image from "next/image";
import Link from "next/link";

interface Props {
  openOAuth: boolean;
  setOpenOAuth: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export default function TopNavBar(props: Props): ReactElement {
  const { openOAuth, setOpenOAuth } = props;

  return (
    <div className="flex flex-row justify-between items-center gap-2">
      <Link href="/">
        <Image src="/roady_logo.svg" width="24" height="24" alt="logo" />
      </Link>
      <ModeToggle />
      <GoogleOAuth setOpenOAuth={setOpenOAuth} openOAuth={openOAuth} />
      <UserProfile />
    </div>
  );
}
