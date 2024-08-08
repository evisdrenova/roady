import { ReactElement } from "react";
import { ModeToggle } from "./ModeToggle";
import GoogleOAuth from "./GoogleOAuth";
import UserProfile from "./UserProfile";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

interface Props {
  openOAuth: boolean;
  setOpenOAuth: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export default function TopNavBar(props: Props): ReactElement {
  const { openOAuth, setOpenOAuth } = props;

  const theme = useTheme();

  return (
    <div className="flex flex-row justify-between items-center gap-2">
      {theme.theme == "light" ? (
        <Link href="/">
          <Image
            src="/roady_logo_light.svg"
            width="24"
            height="24"
            alt="logo"
          />
        </Link>
      ) : (
        <Link href="/">
          <Image src="/roady_logo_dark.svg" width="24" height="24" alt="logo" />
        </Link>
      )}
      <div className="flex flex-row gap-1">
        <ModeToggle />
        <GoogleOAuth setOpenOAuth={setOpenOAuth} openOAuth={openOAuth} />
        <UserProfile />
      </div>
    </div>
  );
}
