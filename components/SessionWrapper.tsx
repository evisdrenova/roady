import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
