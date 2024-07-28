import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function CheckAuth(props: Props) {
  const { children } = props;
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="));
    if (token) {
      fetch("/api/auth/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.valid) {
            router.push("/");
          }
        })
        .catch(() => {
          router.push("/");
        });
    } else {
      router.push("/");
    }
  }, [router]);

  return <>{children}</>;
}
