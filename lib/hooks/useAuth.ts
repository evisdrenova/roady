import { useState, useEffect } from "react";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("the cookie", document.cookie.split("; "));
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("roady_auth_token="))
      ?.split("=")[1];

    if (!token) {
      console.log("token isn't set");
      setIsAuthenticated(false);
      setLoading(false);
    } else {
      console.log("token is set");
      fetch("/api/auth/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsAuthenticated(data.valid);
          setLoading(false);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setLoading(false);
        });
    }
  }, []);

  return { isAuthenticated, loading };
}
